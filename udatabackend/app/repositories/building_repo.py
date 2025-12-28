from sqlalchemy.ext.asyncio import AsyncSession
from app.models.building import Building
from app.repositories.base import BaseRepository
from sqlalchemy import select

class BuildingRepository(BaseRepository[Building]):
    def __init__(self, session: AsyncSession):
        super().__init__(Building, session)

    async def get_by_code(self, campus_id, code):
        stmt = select(Building).where(
            Building.campus_id == campus_id,
            Building.code == code,
            Building.deleted_at.is_(None)
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_by_campus(self, campus_id):
        stmt = select(Building).where(
            Building.campus_id == campus_id,
            Building.deleted_at.is_(None)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()
