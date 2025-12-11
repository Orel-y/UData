from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


from app.core.database import get_session
from app.models.main_models import Building
from app.schemas.schemas import BuildingRead, BuildingCreate

from typing import List

router = APIRouter(prefix="/buildings", tags=["buildings"])

@router.get("/", response_model=List[BuildingRead])
async def get_buildings(session: Session = Depends(get_session)):
    return session.query(Building).all()

@router.post("/", response_model=BuildingCreate)
async def create_building(
        building: BuildingCreate,
        session: Session = Depends(get_session)
    ):

    db_building = Building(**building.dict())
    session.add(db_building)
    session.commit()
    session.refresh(db_building)

    return db_building