from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List
from app.core.database import get_session
from app.models.main_models import Campus
from app.schemas.schemas import CampusRead, CampusCreate, CampusWithBuildings

router = APIRouter(prefix="/campuses", tags=["campuses"])

@router.get("/", response_model=List[CampusRead])
def list_campuses(
        session: Session = Depends(get_session)
    ):

    return session.query(Campus).all()

@router.get("/nested", response_model=List[CampusWithBuildings])
def list_campuses_with_buildings(
        session: Session = Depends(get_session)
    ):

    return session.query(Campus).options(selectinload(Campus.buildings)).all()

@router.post("/", response_model=CampusRead)
def create_campus(
        campus: CampusCreate,
        session: Session = Depends(get_session)
    ):
    db_campus = Campus(**campus.dict())
    session.add(db_campus)
    session.commit()
    session.refresh(db_campus)

    return db_campus

@router.put("/{campus_id}", response_model=CampusRead)
def update_campus(
        campus_id: int,
        campus_data: CampusCreate,
        session: Session = Depends(get_session)
    ):
    campus = session.query(Campus).filter(Campus.id == campus_id).first()
    if not campus:
        raise HTTPException(status_code=404, detail="Campus not found")
    campus.name = campus_data.name
    campus.location = campus_data.location
    session.commit()
    session.refresh(campus)

    return campus

@router.delete("/{campus_id}")
def delete_campus(
        campus_id: int, session:
        Session = Depends(get_session)
    ):
    campus = session.query(Campus).filter(Campus.id == campus_id).first()
    if not campus:
        raise HTTPException(status_code=404, detail="Campus not found")
    session.delete(campus)
    session.commit()

    return {"detail": "Campus deleted"}
