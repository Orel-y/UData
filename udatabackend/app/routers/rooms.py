from typing import List

from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_session
from app.models.main_models import Room
from app.schemas.schemas import RoomRead, RoomCreate


router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("/", response_model=List[RoomRead])
async def get_rooms(session: Session = Depends(get_session)):
    return session.query(Room).all()

@router.post("/", response_model=RoomCreate)
async def create_room(
        room: RoomCreate,
        session: Session = Depends(get_session)
    ):
    db_room = Room(**room.dict())
    session.add(db_room)
    session.commit()
    session.refresh(db_room)

    return db_room
