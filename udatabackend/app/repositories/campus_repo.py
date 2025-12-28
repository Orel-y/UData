# repositories/campus_repo.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.campus import Campus
from typing import Optional
from uuid import UUID
from app.repositories.base import BaseRepository

class CampusRepository(BaseRepository[Campus]):
    def __init__(self, session: AsyncSession):
        super().__init__(Campus, session)


    async def create(self, campus: Campus) -> Campus:
        self.session.add(campus)
        await self.session.commit()
        await self.session.refresh(campus)
        return campus



    async def get_by_code(self, code: str) -> Optional[Campus]:
        result = await self.session.execute(
            select(self.model).where(self.model.code == code)
        )
        return result.scalars().first()


    async def soft_delete(self, campus: Campus) -> Campus:
        from datetime import datetime
        campus.deleted_at = datetime.utcnow()
        await self.session.commit()
        await self.session.refresh(campus)
        return campus

