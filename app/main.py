from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.database import init_db
from app.routes import router

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Daily Task Tracker")

app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static",
)

@app.on_event("startup")
def startup():
    init_db()


@app.get("/", include_in_schema=False)
def home():
    return FileResponse(BASE_DIR /"static" / "index.html")


@app.get("/health")
def health_check():
    return{"status": "healthy"}

app.include_router(router)