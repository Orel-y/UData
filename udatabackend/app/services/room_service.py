from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.room import Room
from app.models.user import User
from app.repositories.room_repo import RoomRepository
from app.repositories.building_repo import BuildingRepository
from app.schemas.room import RoomCreate, RoomUpdate


class RoomService:
    def __init__(self, session: AsyncSession, current_user: User):
        self.session = session
        self.current_user = current_user
        self.repo = RoomRepository(session)
        self.building_repo = BuildingRepository(session)

    async def get_room(self, room_id: UUID) -> Room:
        room = await self.repo.get_by_id(room_id)
        if not room:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )
        return room

    async def list_rooms(self):
        return await self.repo.list_all()

    async def list_rooms_by_building(self, building_id: UUID):
        return await self.repo.list_by_building(building_id)

    async def create_room(self, payload: RoomCreate) -> Room:
        building = await self.building_repo.get_by_id(payload.building_id)
        if not building:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Building not found"
            )

        if await self.repo.exists_in_building(payload.building_id, payload.code):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Room code already exists in this building"
            )

        if payload.capacity is not None and payload.capacity < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Capacity cannot be negative"
            )

        room = Room(
            building_id=payload.building_id,
            code=payload.code,
            name=payload.name,
            capacity=payload.capacity,
            floor=payload.floor,
            type=payload.type,
            status=payload.status,
            meta_info=payload.meta_info,
            created_by_id=self.current_user.id
        )

        return await self.repo.create(room)

    async def update_room(self, room_id: UUID, payload: RoomUpdate) -> Room:
        room = await self.get_room(room_id)

        update_data = payload.dict(exclude_unset=True)

        if "capacity" in update_data and update_data["capacity"] < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Capacity cannot be negative"
            )

        update_data["updated_by_id"] = self.current_user.id

        return await self.repo.update(room, update_data)

    async def delete_room(self, room_id: UUID):
        room = await self.get_room(room_id)
        return await self.repo.soft_delete(room)
