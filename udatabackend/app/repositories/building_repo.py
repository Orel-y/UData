from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from app.models.building import Building
from app.repositories.base import BaseRepository


class BuildingRepository(BaseRepository[Building]):
    def __init__(self, session: AsyncSession):
        super().__init__(Building, session)

    async def list_buildings_by_campus(self, campus_id):
        stmt = (
            select(Building)
            .where(
                Building.campus_id == campus_id,
                Building.deleted_at.is_(None)
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().unique().all()

    async def exists_in_campus(self, campus_id, code: str) -> bool:
        stmt = (
            select(Building.id)
            .where(
                Building.campus_id == campus_id,
                Building.code == code,
                Building.deleted_at.is_(None)
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar() is not None

    async def create(self, building: Building):
        self.session.add(building)
        await self.session.commit()
        await self.session.refresh(building)
        return building

    async def update(self, building: Building, data: dict):
        for key, value in data.items():
            setattr(building, key, value)
        await self.session.commit()
        await self.session.refresh(building)
        return building

    async def soft_delete(self, building: Building):
        building.deleted_at = datetime.utcnow()
        await self.session.commit()
        return building
