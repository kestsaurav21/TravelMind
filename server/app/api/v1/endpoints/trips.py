from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Dict, Any

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.crud.crud_trip import (
    get_trip_by_id,
    get_trips_by_user,
    create_trip,
    update_trip,
    delete_trip,
)
from app.schemas.trip import (
    TripCreate,
    TripUpdate,
    TripResponse,
    TripListResponse,
)

router = APIRouter()

@router.post("/", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_new_trip(
    trip_in: TripCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Create a new trip for the current user.
    """
    new_trip = create_trip(db, trip_in=trip_in, user_id=current_user.id)
    return {"success": True, "data": new_trip}

@router.get("/", response_model=TripListResponse)
def read_trips(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Retrieve all trips for the current user.
    """
    trips = get_trips_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return {"success": True, "data": trips}

@router.get("/{trip_id}", response_model=TripResponse)
def read_trip(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Retrieve specific trip details.
    """
    trip = get_trip_by_id(db, trip_id=trip_id, user_id=current_user.id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found or you do not have permission to view it"
        )
    return {"success": True, "data": trip}

@router.put("/{trip_id}", response_model=TripResponse)
def update_existing_trip(
    trip_id: UUID,
    trip_in: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Update details of a specific trip.
    """
    trip = get_trip_by_id(db, trip_id=trip_id, user_id=current_user.id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found or you do not have permission to modify it"
        )
    updated = update_trip(db, db_trip=trip, trip_in=trip_in)
    return {"success": True, "data": updated}

@router.delete("/{trip_id}", response_model=dict)
def delete_existing_trip(
    trip_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> dict:
    """
    Delete a specific trip.
    """
    trip = get_trip_by_id(db, trip_id=trip_id, user_id=current_user.id)
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found or you do not have permission to delete it"
        )
    delete_trip(db, db_trip=trip)
    return {"success": True, "message": "Trip successfully deleted"}
