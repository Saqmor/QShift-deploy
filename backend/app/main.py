from fastapi import FastAPI

app = FastAPI(title="QShift API")


@app.get("/")
def root():
    return {"message": "QShift backend is running!"}
