from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.room import Room
from app.repositories.base import BaseRepository

class RoomRepository(BaseRepository[Room]):
    def __init__(self, session: AsyncSession):
        super().__init__(Room, session)

    async def get_by_code(self, building_id, code):
        stmt = select(Room).where(
            Room.building_id == building_id,
            Room.code == code,
            Room.deleted_at.is_(None)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_by_building(self, building_id):
        stmt = select(Room).where(
            Room.building_id == building_id,
            Room.deleted_at.is_(None)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()
