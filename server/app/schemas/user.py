from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from pydantic.alias_generators import to_camel

class BaseSchema(BaseModel):
    """
    Base Pydantic schema configured to serialize to camelCase for the frontend,
    while allowing snake_case instantiation internally in Python.
    """
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class UserBase(BaseSchema):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")

class UserUpdate(BaseSchema):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

# Authentication Tokens
class Token(BaseSchema):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseSchema):
    id: Optional[UUID] = None

# Response Wrapper Envelopes
class UserResponse(BaseSchema):
    success: bool = True
    data: UserOut

class TokenResponse(BaseSchema):
    success: bool = True
    data: Token

