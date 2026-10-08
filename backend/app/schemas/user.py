from pydantic import BaseModel, ConfigDict, EmailStr
from uuid import UUID
from datetime import datetime

class OrganizationBase(BaseModel):
    name: str
    slug: str
    business_type: str | None = None

class OrganizationOut(OrganizationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    email: str
    full_name: str | None = None
    avatar_url: str | None = None

class UserOut(UserBase):
    id: UUID
    firebase_uid: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    organizations: list[OrganizationOut] = []

    model_config = ConfigDict(from_attributes=True)
