from uuid import UUID
from app.schemas.base import BaseSchema, AuditResponse
from app.models.enums import CampusStatus

class CampusCreate(BaseSchema):
    code: str
    name: str
    address: str | None = None

class CampusUpdate(BaseSchema):
    name: str | None = None
    address: str | None = None
    status: CampusStatus | None = None

class CampusResponse(AuditResponse):
    id: UUID
    code: str
    name: str
    address: str | None
    status: CampusStatus
