import uuid
from sqlalchemy import String, Enum, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.enums import BuildingStatus, BuildingType
from app.models.mixins import AuditableMixin
from app.core.base import BaseModel

class Building(BaseModel, AuditableMixin):
    __tablename__ = "building"
    __table_args__ = (
        UniqueConstraint("campus_id", "building_no"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    campus_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("campus.id"), nullable=False)
    prefix: Mapped[str] = mapped_column(String(100))
    building_no: Mapped[str] = mapped_column(String(255), nullable=False)
    floors: Mapped[int | None] = mapped_column(Integer)
    type: Mapped[BuildingType] = mapped_column(Enum(BuildingType), default=BuildingType.OTHER)
    status: Mapped[BuildingStatus] = mapped_column(Enum(BuildingStatus), default=BuildingStatus.ACTIVE)

    campus = relationship("Campus", back_populates="buildings")
    rooms = relationship("Room", back_populates="building", lazy="selectin")
    
    @property
    def building_name(self) -> str:
        return f"{self.prefix}{self.building_no}"
