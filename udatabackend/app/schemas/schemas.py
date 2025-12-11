from pydantic import BaseModel
from typing import Optional, List


class CampusBase(BaseModel):
    name: str
    location: Optional[str] = None

class CampusCreate(CampusBase):
    pass

class CampusRead(CampusBase):
    id: int
    class Config:
        orm_mode = True


class BuildingBase(BaseModel):
    name: str
    floor_count: int
    campus_id: int

class BuildingCreate(BuildingBase):
    pass

class BuildingRead(CampusRead):
    id: int
    class Config:
        orm_mode = True


class RoomBase(BaseModel):
    building_id: int
    room_number: str
    capacity: int
    room_type: str
    description: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomRead(CampusRead):
    id: int
    class Config:
        orm_mode = True