from fastapi import APIRouter, HTTPException, Query, status
from app.services.weather import get_weather_forecast

router = APIRouter()

@router.get("/")
async def get_forecast(
    lat: float = Query(..., description="Latitude of the location"),
    lon: float = Query(..., description="Longitude of the location")
) -> dict:
    """
    Get 7-day weather forecast details for the specified latitude and longitude.
    """
    forecast_data = await get_weather_forecast(lat, lon)
    if not forecast_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve weather forecast for the specified coordinates"
        )
    return {"success": True, "data": forecast_data}
