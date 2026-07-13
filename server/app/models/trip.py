import uuid
from sqlalchemy import Column, String, Float, Date, DateTime, JSON, ForeignKey, func, UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    destination = Column(String, nullable=False)
    departure_location = Column(String, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    budget = Column(Float, nullable=False)
    travel_style = Column(String, nullable=True)
    interests = Column(JSON, nullable=True)  # Store array of strings like ["history", "nature"]
    
    # Audit fields
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="trips")
