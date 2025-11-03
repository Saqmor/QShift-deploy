from uuid import UUID

from fastapi import APIRouter, status, Depends, Response, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_session
from app.api.dependencies import current_user_id
from app.schemas.availability import AvailabilityCreate, AvailabilityOut
from app.models.availability import Availability
from app.models.employee import Employee

router = APIRouter(
    prefix="/employees/{employee_id}/availabilities", tags=["availabilities"]
)


@router.post("", response_model=AvailabilityOut, status_code=status.HTTP_201_CREATED)
def create_availability(
    payload: AvailabilityCreate,
    response: Response,
    employee_id: UUID,
    user_id: UUID = Depends(current_user_id),
    db: Session = Depends(get_session),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id, Employee.user_id == user_id)
        .first()
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )

    availability = Availability(
        user_id=user_id, employee_id=employee_id, **payload.model_dump()
    )

    db.add(availability)
    db.flush()
    db.refresh(availability)

    response.headers["Location"] = (
        f"employees/{employee_id}/availabilities/{availability.id}"
    )

    return availability


@router.get("", response_model=list[AvailabilityOut], status_code=status.HTTP_200_OK)
def get_availabilities(
    employee_id: UUID,
    user_id: UUID = Depends(current_user_id),
    db: Session = Depends(get_session),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id, Employee.user_id == user_id)
        .first()
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )

    availabilities = (
        db.query(Availability)
        .filter(
            Availability.employee_id == employee_id, Availability.user_id == user_id
        )
        .order_by(Availability.weekday, Availability.start_time)
        .all()
    )

    return availabilities
