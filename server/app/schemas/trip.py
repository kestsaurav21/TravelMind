from datetime import date, datetime
from typing import Optional, List
from uuid import UUID
from pydantic import Field, field_validator
from app.schemas.user import BaseSchema

class TripBase(BaseSchema):
    destination: str
    departure_location: Optional[str] = None
    start_date: date
    end_date: date
    budget: float = Field(..., ge=0, description="Budget must be greater than or equal to 0")
    travel_style: Optional[str] = None
    interests: Optional[List[str]] = Field(default_factory=list)

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, end_date: date, info) -> date:
        """
        Validate that the end date is on or after the start date.
        """
        if "start_date" in info.data and end_date < info.data["start_date"]:
            raise ValueError("end_date cannot be earlier than start_date")
        return end_date

class TripCreate(TripBase):
    pass

class TripUpdate(BaseSchema):
    destination: Optional[str] = None
    departure_location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = Field(None, ge=0)
    travel_style: Optional[str] = None
    interests: Optional[List[str]] = None

class TripOut(TripBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

# Response Wrapper Envelopes
class TripResponse(BaseSchema):
    success: bool = True
    data: TripOut

class TripListResponse(BaseSchema):
    success: bool = True
    data: List[TripOut]
