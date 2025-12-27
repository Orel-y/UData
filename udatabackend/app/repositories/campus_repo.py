from sqlalchemy.ext.asyncio import AsyncSession
from app.models.campus import Campus
from app.repositories.base import BaseRepository
from sqlalchemy import select

class CampusRepository(BaseRepository[Campus]):
    def __init__(self, session: AsyncSession):
        super().__init__(Campus, session)

    async def get_by_code(self, code: str):
        stmt = select(Campus).where(Campus.code == code, Campus.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        return result.scalars().first()
