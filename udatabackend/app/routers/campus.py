from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_session
from app.auth.dependencies import get_current_user
from app.services.campus_service import CampusService
from app.schemas.campus import CampusCreate, CampusUpdate, CampusResponse
from app.services.exceptions import ServiceError, NotFoundError, ConflictError
from app.models.user import User

router = APIRouter(prefix="/campuses", tags=["Campuses"])

# Dependency to create service
def get_service(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return CampusService(session, current_user)

# Create campus
@router.post("/", response_model=CampusResponse)
async def create_campus(
    payload: CampusCreate,
    service: CampusService = Depends(get_service)
):
    try:
        campus = await service.create_campus(payload)
        return campus
    except ConflictError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

# List campuses
@router.get("/", response_model=List[CampusResponse])
async def list_campuses(service: CampusService = Depends(get_service)):
    return await service.repo.list_all()

# Get single campus
@router.get("/{campus_id}", response_model=CampusResponse)
async def get_campus(campus_id: str, service: CampusService = Depends(get_service)):
    try:
        return await service.get_campus(campus_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# Update campus
@router.put("/{campus_id}", response_model=CampusResponse)
async def update_campus(
    campus_id: str,
    payload: CampusUpdate,
    service: CampusService = Depends(get_service)
):
    try:
        return await service.update_campus(campus_id, payload)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# Soft delete campus
@router.delete("/{campus_id}", response_model=CampusResponse)
async def delete_campus(campus_id: str, service: CampusService = Depends(get_service)):
    try:
        return await service.delete_campus(campus_id)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
