from fastapi import FastAPI
from app.core.config import settings
from app.core.db import engine
from sqlalchemy import text

app = FastAPI(title="QShift API")


@app.get("/")
def root():
    return {"message": "QShift backend is running!", "env": settings.ENV}


@app.get("/healthz/db")
def healthz_db():
    with engine.begin() as conn:
        result = conn.execute(text("SELECT 1"))
        one = result.scalar_one()
    return {"database": "ok", "select_1": one}
