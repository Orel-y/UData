from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from dotenv import load_dotenv
import os
from app.models.user import User
from app.models.campus import Campus
from app.models.building import Building
from app.models.room import Room
from app.models.role import Role
from app.models.user_role import UserRole

from app.core.base import BaseModel

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
_ = User

engine = create_engine(
    DATABASE_URL,
    echo=True,
    future=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

def get_session() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

def create_tables():
    BaseModel.metadata.create_all(bind=engine)
