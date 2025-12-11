from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Column, ForeignKey

class BaseModel(DeclarativeBase):
    pass

class Campus(BaseModel):
    __tablename__ = "campus"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    location: Mapped[str] = mapped_column(String(50))

    buildings: Mapped[list["Building"]] = relationship(back_populates="campus")

class Building(BaseModel):
    __tablename__ = "building"

    id: Mapped[int] = mapped_column(primary_key=True)
    campus_id: Mapped[int] = mapped_column(ForeignKey("campus.id"))
    name: Mapped[str] = mapped_column(String(50))
    floor_count: Mapped[int] = mapped_column(Integer)

    campus: Mapped["Campus"] = relationship(back_populates="buildings")
    rooms: Mapped[list["Room"]] = relationship(back_populates="building")


class Room(BaseModel):
    __tablename__ = "room"

    id: Mapped[int] = mapped_column(primary_key=True)
    building_id: Mapped[int] = mapped_column(ForeignKey("building.id"))
    room_number: Mapped[str] = mapped_column(String(50))
    capacity: Mapped[int] = mapped_column(Integer)
    room_type: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(200))

    building: Mapped["Building"] = relationship(back_populates="rooms")


