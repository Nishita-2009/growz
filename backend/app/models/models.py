"""
SQLAlchemy Models for User, Organization, and UserOrganization.
"""
import uuid
import enum
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Table, Column, Uuid, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship


from app.db.session import Base


class RoleEnum(str, enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"
    OWNER = "owner"


class UserOrganization(Base):
    __tablename__ = "user_organizations"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("organizations.id", ondelete="CASCADE"), primary_key=True
    )
    role: Mapped[RoleEnum] = mapped_column(
        SQLEnum(RoleEnum, name="user_org_role", native_enum=False), default=RoleEnum.MEMBER
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="organization_links")
    organization: Mapped["Organization"] = relationship("Organization", back_populates="user_links")


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    firebase_uid: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    organization_links: Mapped[list["UserOrganization"]] = relationship(
        "UserOrganization", back_populates="user", cascade="all, delete-orphan"
    )

    @property
    def organizations(self) -> list["Organization"]:
        return [link.organization for link in self.organization_links]


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    business_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    user_links: Mapped[list["UserOrganization"]] = relationship(
        "UserOrganization", back_populates="organization", cascade="all, delete-orphan"
    )

    @property
    def users(self) -> list["User"]:
        return [link.user for link in self.user_links]
