from uuid import UUID
from pydantic import EmailStr
from app.schemas.base import BaseSchema
from app.schemas.role import RoleResponse
from app.models.enums import UserStatus

class UserCreate(BaseSchema):
    username: str
    email: EmailStr
    password: str
    full_name: str | None = None

class UserUpdate(BaseSchema):
    full_name: str | None = None
    status: UserStatus | None = None

class UserResponse(BaseSchema):
    id: UUID
    username: str
    email: EmailStr
    full_name: str | None
    status: UserStatus
    roles: list[RoleResponse]
