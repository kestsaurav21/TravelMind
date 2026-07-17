import logging
from typing import Optional, Dict, Any, List
import httpx

logger = logging.getLogger(__name__)

async def get_weather_forecast(lat: float, lon: float) -> Optional[Dict[str, Any]]:
    """
    Fetch a 7-day weather forecast from Open-Meteo for the given latitude and longitude.
    """
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max,rain_sum",
        "timezone": "auto"
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if "daily" not in data:
                logger.warning(f"No weather forecast daily section found for coordinates: {lat}, {lon}")
                return None
                
            daily = data["daily"]
            forecast = []
            
            for i in range(len(daily.get("time", []))):
                forecast.append({
                    "date": daily["time"][i],
                    "temp_max": daily["temperature_2m_max"][i],
                    "temp_min": daily["temperature_2m_min"][i],
                    "precip_probability": daily["precipitation_probability_max"][i],
                    "rain_sum": daily["rain_sum"][i]
                })
                
            return {
                "latitude": lat,
                "longitude": lon,
                "forecast": forecast
            }
    except Exception as e:
        logger.error(f"Weather forecast error for {lat}, {lon}: {str(e)}")
        return None
