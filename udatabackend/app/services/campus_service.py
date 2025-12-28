# services/campus_service.py
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.campus import Campus
from app.repositories.campus_repo import CampusRepository
from typing import List
from datetime import datetime
from uuid import UUID

class CampusService:
    def __init__(self, session: AsyncSession, current_user: User):
        self.session = session
        self.repo = CampusRepository(session)
        self.current_user = current_user

    async def create_campus(self, code: str, name: str, address: str | None = None, status=None) -> Campus:
        existing = await self.repo.get_by_code(code)
        if existing:
            raise HTTPException(status_code=409, detail="Campus code already exists")
        campus = Campus(
            code=code,
            name=name,
            address=address,
            status=status,
            created_by_id=self.current_user.id
        )
        return await self.repo.create(campus)

    async def list_campuses(self) -> List[Campus]:
        return await self.repo.list_all()

    async def get_campus(self, campus_id: UUID) -> Campus:
        campus = await self.repo.get_by_id(campus_id)
        if not campus or campus.deleted_at is not None:
            raise HTTPException(status_code=404, detail="Campus not found")
        return campus

    async def update_campus(self, campus_id: UUID, data: dict) -> Campus:
        campus = await self.get_campus(campus_id)
        data['updated_by_id'] = self.current_user.id
        return await self.repo.update(campus, data)

    async def delete_campus(self, campus_id: UUID) -> Campus:
        campus = await self.get_campus(campus_id)
        campus.updated_by_id = self.current_user.id
        return await self.repo.soft_delete(campus)
