# schemas/campus.py
from pydantic import BaseModel
from typing import Optional
from app.models.enums import CampusStatus
from datetime import datetime
from uuid import UUID


class CampusBase(BaseModel):
    code: Optional[str]
    name: Optional[str]
    address: Optional[str]
    status: Optional[CampusStatus]


class CampusCreate(CampusBase):
    code: str
    name: str
    status: CampusStatus = CampusStatus.ACTIVE


class CampusUpdate(CampusBase):
    # all fields optional for patch/update
    pass


class CampusResponse(BaseModel):
    id: UUID
    code: str
    name: str
    address: Optional[str]
    status: CampusStatus

    created_at: datetime
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime]

    created_by_id: Optional[UUID]
    updated_by_id: Optional[UUID]

    class Config:
        orm_mode = True


class CampusDeleteResponse(BaseModel):
    id: UUID
    deleted_at: datetime

    class Config:
        orm_mode = True

