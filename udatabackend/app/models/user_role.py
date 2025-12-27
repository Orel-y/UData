from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.core.base import BaseModel

class UserRole(BaseModel):
    __tablename__ = "user_roles"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id"), primary_key=True
    )
    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id"), primary_key=True
    )
