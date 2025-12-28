from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from uuid import UUID

from app.models.room import Room
from app.repositories.base import BaseRepository


class RoomRepository(BaseRepository[Room]):
    def __init__(self, session: AsyncSession):
        super().__init__(Room, session)

    async def list_by_building(self, building_id: UUID):
        stmt = (
            select(Room)
            .where(
                Room.building_id == building_id,
                Room.deleted_at.is_(None)
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().unique().all()

    async def exists_in_building(self, building_id: UUID, code: str) -> bool:
        stmt = (
            select(Room.id)
            .where(
                Room.building_id == building_id,
                Room.code == code,
                Room.deleted_at.is_(None)
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar() is not None

    async def create(self, room: Room):
        self.session.add(room)
        await self.session.commit()
        await self.session.refresh(room)
        return room

    async def update(self, room: Room, data: dict):
        for key, value in data.items():
            setattr(room, key, value)
        await self.session.commit()
        await self.session.refresh(room)
        return room

    async def soft_delete(self, room: Room):
        room.deleted_at = datetime.utcnow()
        await self.session.commit()
        return room
