from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from app.core.database import get_session
from app.models.main_models import Building
from app.schemas.schemas import BuildingRead, BuildingCreate, BuildingWithRooms

router = APIRouter(prefix="/buildings", tags=["buildings"])

@router.get("/", response_model=List[BuildingRead])
def list_buildings(
        campus_id: Optional[int] = None,
        session: Session = Depends(get_session)
    ):
    query = session.query(Building)
    if campus_id:
        query = query.filter(Building.campus_id == campus_id)

    return query.all()

@router.get("/nested", response_model=List[BuildingWithRooms])
def list_buildings_with_rooms(
        campus_id: Optional[int] = Query(None),
        session: Session = Depends(get_session)
    ):
    query = session.query(Building).options(selectinload(Building.rooms))
    if campus_id:
        query = query.filter(Building.campus_id == campus_id)

    return query.all()

@router.get("/{building_id}", response_model=BuildingWithRooms)
def get_building(
        building_id: int,
        session: Session = Depends(get_session)
    ):
    building = session.query(Building).options(selectinload(Building.rooms)).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    return building

@router.post("/", response_model=BuildingRead)
def create_building(
        building: BuildingCreate,
        session: Session = Depends(get_session)
    ):
    db_building = Building(**building.dict())
    session.add(db_building)
    session.commit()
    session.refresh(db_building)

    return db_building

@router.put("/{building_id}", response_model=BuildingRead)
def update_building(
        building_id: int, building_data:
        BuildingCreate, session: Session = Depends(get_session)
    ):
    building = session.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    building.name = building_data.name
    building.floor_count = building_data.floor_count
    building.campus_id = building_data.campus_id
    session.commit()
    session.refresh(building)

    return building

@router.delete("/{building_id}")
def delete_building(
        building_id: int,
        session: Session = Depends(get_session)
    ):
    building = session.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    session.delete(building)
    session.commit()

    return {"detail": "Building deleted"}
