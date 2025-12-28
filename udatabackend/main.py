from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import create_tables
from app.routers.campus import router as campus_router  # import router
from app.routers.auth import router as auth_router
from app.routers.building import router as building_router
from app.routers.room import router as room_router

app = FastAPI(title="UData")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://u-data.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await create_tables()

@app.get("/")
def home():
    return {"message": "API running"}


app.include_router(auth_router)
app.include_router(campus_router)
app.include_router(building_router)
app.include_router(room_router)

