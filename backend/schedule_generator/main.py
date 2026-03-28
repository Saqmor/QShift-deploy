from fastapi import BackgroundTasks, FastAPI

import app.schemas.schedule as schemas
from app.core.logging import logger
from schedule_generator import service

app = FastAPI(title="QShift Schedule Generator")


@app.get("/")
def root():
    logger.info("Generator endpoint / accessed")
    return {"message": "QShift schedule generator is running!"}


@app.get("/healthz")
def healthz():
    logger.info("Generator health check OK")
    return {"status": "ok"}


@app.post(
    "/internal/generate-schedule",
    response_model=schemas.ScheduleGenerationJobAcceptedOut,
    status_code=202,
)
def generate_schedule(
    dispatch_request: schemas.ScheduleGenerationDispatchRequest,
    background_tasks: BackgroundTasks,
):
    background_tasks.add_task(
        service.process_schedule_generation_job,
        dispatch_request,
    )
    return schemas.ScheduleGenerationJobAcceptedOut(
        job_id=dispatch_request.job_id,
        status=schemas.ScheduleGenerationJobStatus.PROCESSING,
    )
