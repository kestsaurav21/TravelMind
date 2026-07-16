from fastapi import APIRouter, HTTPException, Query, status
from app.services.maps import geocode_destination

router = APIRouter()

@router.get("/geocode")
async def geocode_query(
    q: str = Query(..., description="Location to geocode")
) -> dict:
    """
    Geocode a query string to fetch coordinates (latitude and longitude).
    """
    coords = await geocode_destination(q)
    if not coords:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Coordinates not found for query: {q}"
        )
    return {"success": True, "data": coords}
