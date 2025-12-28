# routers/building.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.schemas.building import (
    BuildingCreate,
    BuildingUpdate,
    BuildingResponse,
    BuildingDeleteResponse,
)
from app.services.building_service import BuildingService
from app.core.database import get_session
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/buildings", tags=["Buildings"])


@router.post("/", response_model=BuildingResponse)
async def create_building(
        payload: BuildingCreate,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = BuildingService(session, current_user)
    return await service.create_building( payload )


@router.get("/", response_model=List[BuildingResponse])
async def list_buildings(
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = BuildingService(session, current_user)
    return await service.list_buildings()


@router.get("/{building_id}", response_model=BuildingResponse)
async def get_building(
        building_id: UUID,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = BuildingService(session, current_user)
    return await service.get_building(building_id)


@router.get("/campus/{campus_id}", response_model=List[BuildingResponse])
async def list_buildings_by_campus(
        campus_id: UUID,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = BuildingService(session, current_user)
    return await service.list_buildings_by_campus(campus_id)


@router.put("/{building_id}", response_model=BuildingResponse)
async def update_building(
    building_id: UUID,
    payload: BuildingUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    service = BuildingService(session, current_user)
    return await service.update_building(building_id, payload)



@router.delete("/{building_id}", response_model=BuildingDeleteResponse)
async def delete_building(
        building_id: UUID,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = BuildingService(session, current_user)
    return await service.delete_building(building_id)
