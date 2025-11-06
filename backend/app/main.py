from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import engine
from app.api import api_router

app = FastAPI(title="QShift API")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # origem do seu frontend (Vite)
    allow_credentials=True,
    allow_methods=["*"],  # permite GET, POST, PATCH, DELETE, etc.
    allow_headers=["*"],  # permite todos os headers
)

@app.get("/")
def root():
    return {"message": "QShift backend is running!", "env": settings.ENV}


@app.get("/healthz/db")
def healthz_db():
    with engine.begin() as conn:
        result = conn.execute(text("SELECT 1"))
        one = result.scalar_one()
    return {"database": "ok", "select_1": one}
