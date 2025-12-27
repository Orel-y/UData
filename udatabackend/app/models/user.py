import uuid
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.enums import UserStatus

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column( primary_key=True, default=uuid.uuid4 )
    username: Mapped[str] = mapped_column( String(100), unique=True, nullable=False )
    email: Mapped[str] = mapped_column( String(255), unique=True, nullable=False )
    password_hash: Mapped[str] = mapped_column( String(255), nullable=False )
    full_name: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[UserStatus] = mapped_column( Enum(UserStatus), default=UserStatus.ACTIVE )

    roles = relationship(
        "Role",
        secondary="user_roles",
        back_populates="users",
        lazy="selectin",
    )
