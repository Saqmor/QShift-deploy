import uuid
from datetime import time
from typing import List

import pytest

from app.services.schedule import ScheduleGenerator
from app.domain import shift as shift_domain
import app.schemas.schedule as schemas


# -----------------------------
# Helpers
# -----------------------------

def _t(h: int, m: int = 0) -> time:
    return time(hour=h, minute=m)


def _overlap(s1: shift_domain.Shift, s2: shift_domain.Shift) -> bool:
    """Return True if two domain.Shift overlap in time and weekday."""
    if s1.weekday != s2.weekday:
        return False
    start1 = s1.start_time.hour * 60 + s1.start_time.minute
    end1 = s1.end_time.hour * 60 + s1.end_time.minute
    start2 = s2.start_time.hour * 60 + s2.start_time.minute
    end2 = s2.end_time.hour * 60 + s2.end_time.minute
    return not (end1 <= start2 or end2 <= start1)


def _print_schedule(schedule: schemas.ScheduleOut) -> None:
    """Pretty-prints the schedule on the terminal."""
    day_name = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

    def fmt_time(t: time) -> str:
        return f"{t.hour:02d}:{t.minute:02d}"

    print("\n=== ESCALA GERADA ===")
    shifts_sorted = sorted(
        schedule.shifts,
        key=lambda s: (s.weekday, s.start_time, s.end_time),
    )
    if not shifts_sorted:
        print("(no shift)")
        return

    for s in shifts_sorted:
        employees = ", ".join(emp.name or str(emp.employee_id) for emp in s.employees)
        if not employees:
            employees = "(sem alocação)"
        print(
            f"{day_name[s.weekday]} "
            f"{fmt_time(s.start_time)}–{fmt_time(s.end_time)} "
            f"(min={s.min_staff}): {employees}"
        )


def _assert_basic_constraints(gen: ScheduleGenerator, schedule: schemas.ScheduleOut) -> None:
    """Assert exact coverage, availability respect, and no overlap by employee."""
    # 1) Same number of shift slots returned
    assert len(schedule.shifts) == gen.num_shifts

    # Map shift_id -> t index in generator
    idx_by_id = {gen.shift_ids[i]: i for i in range(gen.num_shifts)}

    # 2) Exact coverage and availability respected
    for s_out in schedule.shifts:
        t = idx_by_id[s_out.shift_id]

        # Coverage equals demand
        assert len(s_out.employees) == gen.demand[t]

        # Availability respected
        for emp_out in s_out.employees:
            e_index = gen.employee_ids.index(emp_out.employee_id)
            assert gen.availability_matrix[e_index][t] is True

    # 3) No overlapping shifts per employee
    alloc_per_emp = {e_id: [] for e_id in gen.employee_ids}
    for s_out in schedule.shifts:
        t = idx_by_id[s_out.shift_id]
        s_dom = gen.shift_vector[t]
        for emp in s_out.employees:
            alloc_per_emp[emp.employee_id].append(s_dom)

    for emp_id, assigned in alloc_per_emp.items():
        for i in range(len(assigned)):
            for j in range(i + 1, len(assigned)):
                assert not _overlap(assigned[i], assigned[j]), (
                    f"Employee {emp_id} has overlapping shifts: "
                    f"{assigned[i]} and {assigned[j]}"
                )


# -----------------------------
# Instances
# -----------------------------

def _build_small_instance() -> ScheduleGenerator:
    """
    Small, feasible instance:
      - 4 shifts (Mon 2 + Tue 2)
      - 3 employees
      - demand = 1 per shift
      - overlap constraint forces distinct allocations for overlapping shifts
    """
    employee_ids = [uuid.uuid4() for _ in range(3)]
    employee_names = ["Alice", "Bob", "Carol"]

    # Mon (0): 09-13 (S0) and 12-16 (S1)  -> overlap
    # Tue (1): 09-13 (S2) and 13-17 (S3)  -> no overlap
    shift_ids = [uuid.uuid4() for _ in range(4)]
    shifts: List[shift_domain.Shift] = [
        shift_domain.Shift(id=shift_ids[0], weekday=0, start_time=_t(9), end_time=_t(13), min_staff=1),
        shift_domain.Shift(id=shift_ids[1], weekday=0, start_time=_t(12), end_time=_t(16), min_staff=1),
        shift_domain.Shift(id=shift_ids[2], weekday=1, start_time=_t(9), end_time=_t(13), min_staff=1),
        shift_domain.Shift(id=shift_ids[3], weekday=1, start_time=_t(13), end_time=_t(17), min_staff=1),
    ]

    # Availability [emp][shift]
    availability = [
        [True,  False, True,  False],  # Alice
        [False, True,  False, True ],  # Bob
        [True,  True,  True,  True ],  # Carol (backup)
    ]

    return ScheduleGenerator(
        shift_ids=shift_ids,
        employee_ids=employee_ids,
        employee_names=employee_names,
        shift_vector=shifts,
        availability_matrix=availability,
    )


def _build_week_large_instance() -> ScheduleGenerator:
    """
    Larger, week-long instance:
      - 7 days (Mon..Sun)
      - 3 shifts per day (non-overlapping): 09-13, 13-17, 17-21
      - demand = 2 per shift
      - 7 employees (names fixed), all available to all shifts (robust feasibility)
    """
    employee_names = ["Ana", "Bruno", "Carla", "Diego", "Elaine", "Fabio", "Giovana"]
    employee_ids = [uuid.uuid4() for _ in employee_names]

    # Build 3 shifts per day for 7 days
    shift_ids = []
    shifts: List[shift_domain.Shift] = []
    for d in range(7):
        # Morning 09–13
        s1_id = uuid.uuid4()
        shift_ids.append(s1_id)
        shifts.append(
            shift_domain.Shift(id=s1_id, weekday=d, start_time=_t(9), end_time=_t(13), min_staff=2)
        )

        # Afternoon 13–17
        s2_id = uuid.uuid4()
        shift_ids.append(s2_id)
        shifts.append(
            shift_domain.Shift(id=s2_id, weekday=d, start_time=_t(13), end_time=_t(17), min_staff=2)
        )

        # Evening 17–21
        s3_id = uuid.uuid4()
        shift_ids.append(s3_id)
        shifts.append(
            shift_domain.Shift(id=s3_id, weekday=d, start_time=_t(17), end_time=_t(21), min_staff=2)
        )

    num_shifts = len(shifts)  # 7 * 3 = 21
    num_employees = len(employee_ids)  # 7

    # Make everyone available to every shift to keep the instance robustly feasible.
    availability = [[True for _ in range(num_shifts)] for _ in range(num_employees)]

    return ScheduleGenerator(
        shift_ids=shift_ids,
        employee_ids=employee_ids,
        employee_names=employee_names,
        shift_vector=shifts,
        availability_matrix=availability,
    )


# -----------------------------
# Fixtures
# -----------------------------

@pytest.fixture
def small_instance():
    return _build_small_instance()


@pytest.fixture
def week_large_instance():
    return _build_week_large_instance()


# -----------------------------
# Tests
# -----------------------------

@pytest.mark.unit
def test_check_possibility_feasible(small_instance: ScheduleGenerator):
    gen = small_instance
    assert gen.check_possibility() is True


@pytest.mark.unit
def test_generate_schedule_basic_constraints(small_instance: ScheduleGenerator):
    gen = small_instance
    schedule: schemas.ScheduleOut = gen.generate_schedule()

    _print_schedule(schedule)
    _assert_basic_constraints(gen, schedule)


@pytest.mark.unit
def test_infeasible_when_no_availability():
    """Make it infeasible removing availability from all employees for the first shift."""
    gen = _build_small_instance()
    for e in range(gen.num_employees):
        gen.availability_matrix[e][0] = False
    assert gen.check_possibility() is False


@pytest.mark.unit
def test_generate_schedule_week_large_instance(week_large_instance: ScheduleGenerator):
    """
    Full-week scenario with multiple employees and higher demand:
      - Ensures the solver honors exact coverage, availability, and no-overlap.
      - Also stresses the fairness and consistency objectives with more degrees of freedom.
    """
    gen = week_large_instance
    # Sanity: feasibility should hold
    assert gen.check_possibility() is True

    schedule: schemas.ScheduleOut = gen.generate_schedule()
    _print_schedule(schedule)
    _assert_basic_constraints(gen, schedule)
