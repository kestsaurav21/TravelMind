import logging
from typing import Optional, Dict, Any
import httpx

logger = logging.getLogger(__name__)

async def geocode_destination(destination: str) -> Optional[Dict[str, Any]]:
    """
    Geocode a destination city/country using the Nominatim OpenStreetMap API.
    Returns a dictionary with latitude, longitude, and display name, or None if not found.
    """
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": destination,
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": "TravelMind-AI-Planner/1.0 (contact: saurabhkestwal)"
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            if not data:
                logger.warning(f"No geocoding results found for destination: {destination}")
                return None
                
            result = data[0]
            return {
                "latitude": float(result["lat"]),
                "longitude": float(result["lon"]),
                "display_name": result["display_name"]
            }
    except Exception as e:
        logger.error(f"Geocoding error for {destination}: {str(e)}")
        return None
