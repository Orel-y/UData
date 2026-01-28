from uuid import UUID
from datetime import datetime
from typing import Optional, Dict

from pydantic import BaseModel
from app.models.enums import RoomStatus, RoomType


class RoomBase(BaseModel):
    prefix: str
    room_no: Optional[str] = None
    capacity: Optional[int] = None
    floor: Optional[int] = None
    type: RoomType = RoomType.OTHER
    status: RoomStatus = RoomStatus.AVAILABLE
    meta_info: Optional[Dict] = None


class RoomCreate(RoomBase):
    building_id: UUID

class RoomUpdate(BaseModel):
    prefix: Optional[str] = None
    room_no: Optional[str] = None
    capacity: Optional[int] = None
    floor: Optional[int] = None
    type: Optional[RoomType] = None
    status: Optional[RoomStatus] = None
    meta_info: Optional[Dict] = None

class RoomResponse(RoomBase):
    id: UUID
    building_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True

class RoomDeleteResponse(RoomResponse):
    deleted_at: datetime

    class Config:
        orm_mode = True
