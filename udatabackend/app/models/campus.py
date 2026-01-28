import uuid
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.base import BaseModel
from app.models.enums import CampusStatus
from app.models.mixins import AuditableMixin

class Campus(BaseModel, AuditableMixin):
    __tablename__ = "campus"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(50), unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[CampusStatus] = mapped_column(Enum(CampusStatus), default=CampusStatus.ACTIVE)

    buildings = relationship("Building", back_populates="campus", lazy="selectin")
