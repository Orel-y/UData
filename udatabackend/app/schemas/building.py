from uuid import UUID
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.enums import BuildingStatus, BuildingType


class BuildingBase(BaseModel):
    code: str
    name: str
    floors: Optional[int] = None
    type: BuildingType = BuildingType.OTHER
    status: BuildingStatus = BuildingStatus.ACTIVE


class BuildingCreate(BuildingBase):
    campus_id: UUID


class BuildingUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    floors: Optional[int] = None
    type: Optional[BuildingType] = None
    status: Optional[BuildingStatus] = None


class BuildingResponse(BuildingBase):
    id: UUID
    campus_id: UUID
    created_at: datetime
    updated_at: datetime | None = None

    class Config:
        from_attributes = True
        orm_mode = True

class BuildingDeleteResponse(BuildingResponse):
    id: UUID
    deleted_at: datetime

    class Config:
        orm_mode = True