# repositories/campus_repo.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.campus import Campus
from typing import Optional
from uuid import UUID

class CampusRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.model = Campus

    async def create(self, campus: Campus) -> Campus:
        self.session.add(campus)
        await self.session.commit()
        await self.session.refresh(campus)
        return campus

    async def get_by_id(self, campus_id: UUID) -> Optional[Campus]:
        return await self.session.get(self.model, campus_id)

    async def get_by_code(self, code: str) -> Optional[Campus]:
        result = await self.session.execute(
            select(self.model).where(self.model.code == code)
        )
        return result.scalars().first()

    async def list_all(self):
        stmt = select(Campus)
        result = await self.session.execute(stmt)
        return result.unique().scalars().all()

    async def update(self, campus: Campus, data: dict) -> Campus:
        for key, value in data.items():
            setattr(campus, key, value)
        await self.session.commit()
        await self.session.refresh(campus)
        return campus

    async def soft_delete(self, campus: Campus) -> Campus:
        from datetime import datetime
        campus.deleted_at = datetime.utcnow()
        await self.session.commit()
        await self.session.refresh(campus)
        return campus

