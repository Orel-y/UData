# services/building_service.py
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.models.building import Building
from app.models.user import User
from app.repositories.building_repo import BuildingRepository
from app.schemas.building import BuildingCreate, BuildingUpdate


class BuildingService:
    def __init__(self, session: AsyncSession, current_user: User):
        self.session = session
        self.current_user = current_user
        self.repo = BuildingRepository(session)

    async def get_building(self, building_id: UUID) -> Building:
        building = await self.repo.get_by_id(building_id)
        if not building:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Building not found"
            )
        return building

    async def list_buildings(self):
        return await self.repo.list_all()

    async def list_buildings_by_campus(self, campus_id: UUID):
        return await self.repo.list_buildings_by_campus(campus_id)
    async def create_building(self, payload: BuildingCreate) -> Building:
        # uniqueness check: (campus_id, code)
        if await self.repo.exists_in_campus(payload.campus_id, payload.building_no):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Building code already exists in this campus"
            )

        if payload.floors is not None and payload.floors < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Floors cannot be negative"
            )

        building = Building(
            campus_id=payload.campus_id,
            prefix=payload.prefix,
            building_no=payload.building_no,
            floors=payload.floors,
            type=payload.type,
            status=payload.status,
            created_by_id=self.current_user.id
        )

        return await self.repo.create(building)

    async def update_building(
        self,
        building_id: UUID,
        payload: BuildingUpdate
    ) -> Building:
        building = await self.get_building(building_id)

        update_data = payload.dict(exclude_unset=True)

        if "floors" in update_data and update_data["floors"] < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Floors cannot be negative"
            )

        update_data["updated_by_id"] = self.current_user.id

        return await self.repo.update(building, update_data)

    async def delete_building(self, building_id: UUID):
        building = await self.get_building(building_id)

        if building.rooms:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete building with rooms"
            )

        return await self.repo.soft_delete(building)
