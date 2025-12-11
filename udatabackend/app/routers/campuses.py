from fastapi import FastAPI, APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql.annotation import Annotated
from typing import List

from app.core.database import SessionLocal, get_session
from app.models.main_models import Campus
from app.schemas.schemas import CampusRead, CampusCreate

router = APIRouter(prefix="/campuses", tags=["campuses"])

@router.get("/", response_model=List[CampusRead])
def read_campuses(session: Session = Depends(get_session)):
    return session.query(Campus).all()

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