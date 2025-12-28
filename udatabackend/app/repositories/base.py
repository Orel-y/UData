from datetime import datetime
from typing import Generic, TypeVar, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import DeclarativeBase

ModelType = TypeVar("ModelType", bound=DeclarativeBase)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_by_id(self, id):
        stmt = select(self.model).where(self.model.id == id, self.model.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_all(self):
        stmt = select(self.model).where(self.model.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def create(self, obj: ModelType):
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def update(self, obj: ModelType, update_data: dict):
        for key, value in update_data.items():
            setattr(obj, key, value)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def soft_delete(self, obj: ModelType):
        obj.deleted_at = datetime.utcnow()
        await self.session.commit()
        return obj
