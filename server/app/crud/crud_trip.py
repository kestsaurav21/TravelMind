from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.trip import Trip
from app.schemas.trip import TripCreate, TripUpdate

def get_trip_by_id(db: Session, trip_id: UUID, user_id: UUID) -> Optional[Trip]:
    """
    Retrieve a specific trip by its ID, verifying it belongs to the specified user.
    """
    return db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()

def get_trips_by_user(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Trip]:
    """
    Retrieve all trips belonging to a user, with optional pagination.
    """
    return db.query(Trip).filter(Trip.user_id == user_id).offset(skip).limit(limit).all()

def create_trip(db: Session, trip_in: TripCreate, user_id: UUID) -> Trip:
    """
    Create a new trip for a user.
    """
    db_trip = Trip(
        user_id=user_id,
        destination=trip_in.destination,
        departure_location=trip_in.departure_location,
        start_date=trip_in.start_date,
        end_date=trip_in.end_date,
        budget=trip_in.budget,
        travel_style=trip_in.travel_style,
        interests=trip_in.interests,
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

def update_trip(db: Session, db_trip: Trip, trip_in: TripUpdate) -> Trip:
    """
    Update an existing trip.
    """
    update_data = trip_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_trip, field, value)
    
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

def delete_trip(db: Session, db_trip: Trip) -> None:
    """
    Delete a trip from the database.
    """
    db.delete(db_trip)
    db.commit()
