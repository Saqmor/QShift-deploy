from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(title="QShift API")


@app.get("/")
def root():
    return {"message": "QShift backend is running!", "env": settings.ENV}
