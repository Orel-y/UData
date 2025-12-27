import uuid
from sqlalchemy import String, Enum, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.base import BaseModel
from app.models.enums import BuildingStatus, BuildingType
from app.models.mixins import AuditableMixin

class Building(BaseModel, AuditableMixin):
    __tablename__ = "building"
    __table_args__ = (
        UniqueConstraint("campus_id", "code"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )

    campus_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("campus.id"), nullable=False
    )

    code: Mapped[str] = mapped_column(String(100))
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    floors: Mapped[int | None] = mapped_column(Integer)

    type: Mapped[BuildingType] = mapped_column(
        Enum(BuildingType), default=BuildingType.OTHER
    )

    status: Mapped[BuildingStatus] = mapped_column(
        Enum(BuildingStatus), default=BuildingStatus.ACTIVE
    )

    campus = relationship("Campus", back_populates="buildings")
    rooms = relationship("Room", back_populates="building", lazy="selectin")
