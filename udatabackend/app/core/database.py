from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker
)
import os

from app.models.user import User
from app.models.campus import Campus
from app.models.building import Building
from app.models.room import Room

from app.core.base import BaseModel

# Load .env only in non-production
if os.getenv("ENV") != "production":
    from dotenv import load_dotenv
    load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set")

connect_args = {}
engine_kwargs = {}

if DATABASE_URL.startswith("postgresql"):
    engine_kwargs = {
        "pool_pre_ping": True,
        "pool_size": 10,
        "max_overflow": 10,
    }

# postgresql+asyncpg://user:pass@localhost/db
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    **engine_kwargs,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
