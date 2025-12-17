from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_session
from app.models.main_models import Room
from app.schemas.schemas import RoomRead, RoomCreate

router = APIRouter(prefix="/rooms", tags=["rooms"])

# Flat list with optional building filter
@router.get("/", response_model=List[RoomRead])
def list_rooms(
        building_id: Optional[int] = Query(None),
        session: Session = Depends(get_session)
    ):
    query = session.query(Room)
    if building_id:
        query = query.filter(Room.building_id == building_id)

    return query.all()

@router.post("/", response_model=RoomRead)
def create_room(
        room: RoomCreate, session:
        Session = Depends(get_session)
    ):
    db_room = Room(**room.dict())
    session.add(db_room)
    session.commit()
    session.refresh(db_room)

    return db_room

@router.put("/{room_id}", response_model=RoomRead)
def update_room(
        room_id: int,
        room_data: RoomCreate,
        session: Session = Depends(get_session)
    ):
    room = session.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    for key, value in room_data.dict().items():
        setattr(room, key, value)
    session.commit()
    session.refresh(room)

    return room

@router.delete("/{room_id}")
def delete_room(
        room_id: int, session:
        Session = Depends(get_session)
    ):
    room = session.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    session.delete(room)
    session.commit()

    return {"detail": "Room deleted"}
