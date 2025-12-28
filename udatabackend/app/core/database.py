from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker
)
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

from app.models.user import User
from app.models.campus import Campus
from app.models.building import Building
from app.models.room import Room

from app.core.base import BaseModel

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# IMPORTANT: async driver
# example:
# postgresql+asyncpg://user:pass@localhost/db
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True
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
