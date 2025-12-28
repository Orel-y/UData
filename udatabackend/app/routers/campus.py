# routers/campus.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.schemas.campus import CampusCreate, CampusResponse, CampusUpdate, CampusDeleteResponse
from app.services.campus_service import CampusService
from app.core.database import get_session
from app.auth.dependencies import get_current_user
from app.models.user import User
from uuid import UUID

router = APIRouter(prefix="/campuses", tags=["Campuses"])

@router.post("/", response_model=CampusResponse)
async def create_campus(
        payload: CampusCreate,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = CampusService(session, current_user)
    return await service.create_campus(payload.code, payload.name, payload.address, payload.status)


@router.get("/", response_model=List[CampusResponse])
async def list_campuses(
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = CampusService(session, current_user)
    return await service.list_campuses()


@router.get("/{campus_id}", response_model=CampusResponse)
async def get_campus(
        campus_id: UUID,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = CampusService(session, current_user)
    return await service.get_campus(campus_id)


@router.put("/{campus_id}", response_model=CampusResponse)
async def update_campus(
        campus_id: UUID,
        payload: CampusUpdate,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = CampusService(session, current_user)
    return await service.update_campus(campus_id, payload.dict(exclude_unset=True))


@router.delete("/{campus_id}", response_model=CampusDeleteResponse)
async def delete_campus(
        campus_id: UUID,
        session: AsyncSession = Depends(get_session),
        current_user: User = Depends(get_current_user)
    ):
    service = CampusService(session, current_user)
    return await service.delete_campus(campus_id)

    #CampusDeleteResponse(id=str(campus.id), deleted_at=campus.deleted_at.isoformat()))
