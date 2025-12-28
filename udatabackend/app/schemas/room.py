from uuid import UUID
from app.schemas.base import BaseSchema, AuditResponse
from app.models.enums import RoomStatus, RoomType

class RoomCreate(BaseSchema):
    building_id: UUID
    code: str
    name: str | None = None
    capacity: int | None = None
    floor: int | None = None
    type: RoomType = RoomType.OTHER
    metadata: dict | None = None

class RoomUpdate(BaseSchema):
    name: str | None = None
    capacity: int | None = None
    floor: int | None = None
    type: RoomType | None = None
    status: RoomStatus | None = None
    metadata: dict | None = None

class RoomResponse(AuditResponse):
    id: UUID
    building_id: UUID
    code: str
    name: str | None
    capacity: int | None
    floor: int | None
    type: RoomType
    status: RoomStatus
    metadata: dict | None
