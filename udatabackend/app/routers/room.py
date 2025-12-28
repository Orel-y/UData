from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.schemas.room import (
    RoomCreate,
    RoomUpdate,
    RoomResponse,
    RoomDeleteResponse
)
from app.services.room_service import RoomService
from app.core.database import get_session
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/rooms", tags=["Rooms"])


@router.post("/", response_model=RoomResponse)
async def create_room(
    payload: RoomCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    service = RoomService(session, current_user)
    return await service.create_room(payload)


@router.get("/", response_model=List[RoomResponse])
async def list_rooms(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    service = RoomService(session, current_user)
    return await service.list_rooms()


@router.get("/{room_id}", response_model=RoomResponse)
async def get_room(
    room_id: UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    service = RoomService(session, current_user)
    return await service.get_room(room_id)


@router.get("/building/{building_id}", response_model=List[RoomResponse])
async def list_rooms_by_building(
    building_id: UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    service = RoomService(session, current_user)
    return await service.list_rooms_by_building(building_id)


@router.put("/{room_id}", response_model=RoomResponse)
async def update_room(
    room_id: UUID,
    payload: RoomUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    service = RoomService(session, current_user)
    return await service.update_room(room_id, payload)


@router.delete("/{room_id}", response_model=RoomDeleteResponse)
async def delete_room(
    room_id: UUID,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    service = RoomService(session, current_user)
    return await service.delete_room(room_id)
