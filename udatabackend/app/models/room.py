import uuid
from sqlalchemy import (
    String, Enum, Integer, ForeignKey, UniqueConstraint, JSON
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.enums import RoomStatus, RoomType
from app.models.mixins import AuditableMixin

class Room(Base, AuditableMixin):
    __tablename__ = "room"
    __table_args__ = (
        UniqueConstraint("building_id", "code"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )

    building_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("building.id"), nullable=False
    )

    code: Mapped[str] = mapped_column(String(100))
    name: Mapped[str | None] = mapped_column(String(255))

    capacity: Mapped[int | None] = mapped_column(Integer)
    floor: Mapped[int | None] = mapped_column(Integer)

    type: Mapped[RoomType] = mapped_column(
        Enum(RoomType), default=RoomType.OTHER
    )

    status: Mapped[RoomStatus] = mapped_column(
        Enum(RoomStatus), default=RoomStatus.AVAILABLE
    )

    metadata: Mapped[dict | None] = mapped_column(JSON)

    building = relationship("Building", back_populates="rooms")
