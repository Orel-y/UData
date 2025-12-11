from fastapi import FastAPI
from app.core.database import create_tables

app = FastAPI()

@app.on_event("startup")
def startup():
    create_tables()

@app.get("/")
def home():
    return {"message": "API running"}
