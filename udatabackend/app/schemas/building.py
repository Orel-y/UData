from uuid import UUID
from app.schemas.base import BaseSchema, AuditResponse
from app.models.enums import BuildingStatus, BuildingType

class BuildingCreate(BaseSchema):
    campus_id: UUID
    code: str
    name: str
    floors: int | None = None
    type: BuildingType = BuildingType.OTHER

class BuildingUpdate(BaseSchema):
    name: str | None = None
    floors: int | None = None
    type: BuildingType | None = None
    status: BuildingStatus | None = None

class BuildingResponse(AuditResponse):
    id: UUID
    campus_id: UUID
    code: str
    name: str
    floors: int | None
    type: BuildingType
    status: BuildingStatus
