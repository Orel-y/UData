from fastapi import FastAPI
from app.core.database import create_tables
from app.core.database import BaseModel, engine
from app.routers import campuses, buildings, rooms

app = FastAPI(title="UData")

@app.on_event("startup")
def startup():
    create_tables()

@app.get("/")
def home():
    return {"message": "API running"}

app.include_router(campuses.router)
app.include_router(buildings.router)
app.include_router(rooms.router)