from pydantic import BaseModel
from app.schemas.base import BaseSchema

class RoleResponse(BaseSchema):
    id: int
    name: str
    description: str | None
