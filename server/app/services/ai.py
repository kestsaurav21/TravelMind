import os
import json
import logging
from typing import Optional, Dict, Any, List
import httpx

logger = logging.getLogger(__name__)

# System instructions to guide the itinerary generation
SYSTEM_INSTRUCTION = """
You are a premium travel concierge. Your job is to create a detailed, highly curated day-by-day travel itinerary and budget breakdown based on the user's travel preferences.
Make sure the recommendations are practical, logical, and highly customized to their interest and travel style.
"""

def get_fallback_itinerary(
    destination: str,
    duration_days: int,
    budget: float,
    travel_style: Optional[str],
    interests: List[str]
) -> Dict[str, Any]:
    """
    Generate a realistic mock itinerary when the Gemini API key is missing or calls fail.
    """
    logger.info("Generating fallback itinerary")
    
    # Calculate budget breakdown
    transportation = round(budget * 0.25, 2)
    accommodation = round(budget * 0.40, 2)
    food = round(budget * 0.15, 2)
    activities = round(budget * 0.12, 2)
    miscellaneous = round(budget * 0.08, 2)
    total_estimated = round(transportation + accommodation + food + activities + miscellaneous, 2)

    style_label = travel_style or "General"
    interests_str = ", ".join(interests) if interests else "Sightseeing"

    itinerary = []
    for day in range(1, duration_days + 1):
        if day == 1:
            title = "Arrival & City Orientation"
            activities_list = [
                {
                    "time": "09:00 AM",
                    "activity": f"Arrive in {destination}",
                    "description": "Check in to accommodation and freshen up after travel.",
                    "location": f"Central {destination}",
                    "cost": 0.0
                },
                {
                    "time": "02:00 PM",
                    "activity": "Guided walking tour",
                    "description": f"A historic stroll around central {destination} to get oriented and see main city spots.",
                    "location": "Old Town / Downtown",
                    "cost": round(activities * 0.1, 2)
                },
                {
                    "time": "07:00 PM",
                    "activity": "Welcome Dinner",
                    "description": f"Dine at a highly recommended local restaurant to sample traditional food.",
                    "location": "Local Bistro",
                    "cost": round(food / duration_days * 0.6, 2)
                }
            ]
        elif day == duration_days:
            title = "Souvenirs & Departure"
            activities_list = [
                {
                    "time": "10:00 AM",
                    "activity": "Local market shopping",
                    "description": "Browse local craft markets for souvenirs and locally-made items.",
                    "location": "Central Market",
                    "cost": round(miscellaneous * 0.5, 2)
                },
                {
                    "time": "01:00 PM",
                    "activity": "Farewell lunch",
                    "description": "Enjoy a quiet lunch at a café overlooking a scenic part of the city.",
                    "location": "Plaza Café",
                    "cost": round(food / duration_days * 0.4, 2)
                },
                {
                    "time": "04:00 PM",
                    "activity": "Depart",
                    "description": "Head to the station or airport for departure journey.",
                    "location": "Transit Terminal",
                    "cost": 0.0
                }
            ]
        else:
            title = f"Exploring {interests_str or 'Local Sights'}"
            activities_list = [
                {
                    "time": "09:30 AM",
                    "activity": f"Visit {destination} Cultural Center or Museum",
                    "description": f"Immerse yourself in history and arts relevant to {interests_str}.",
                    "location": "National Museum",
                    "cost": round(activities * 0.2, 2)
                },
                {
                    "time": "01:00 PM",
                    "activity": "Lunch & Street Art Tour",
                    "description": "Explore the vibrant streets, view local street art and grab lunch.",
                    "location": "Art District",
                    "cost": round(food / duration_days * 0.4, 2)
                },
                {
                    "time": "03:30 PM",
                    "activity": f"Afternoon adventure ({style_label} Style)",
                    "description": f"Engage in activities matching a {style_label} style of traveling.",
                    "location": f"Scenic {destination} spot",
                    "cost": round(activities * 0.15, 2)
                }
            ]
        
        itinerary.append({
            "day": day,
            "title": title,
            "activities": activities_list
        })

    travel_tips = [
        f"Always carry some local cash when visiting street markets in {destination}.",
        "Public transport is highly efficient; consider getting a multi-day transit card.",
        f"Dress respectfully when visiting religious or historical sites in {destination}."
    ]

    return {
        "itinerary": itinerary,
        "budget_breakdown": {
            "transportation": transportation,
            "accommodation": accommodation,
            "food": food,
            "activities": activities,
            "miscellaneous": miscellaneous,
            "total_estimated": total_estimated
        },
        "travel_tips": travel_tips
    }

async def generate_itinerary_with_gemini(
    destination: str,
    departure_location: Optional[str],
    start_date: str,
    end_date: str,
    budget: float,
    travel_style: Optional[str],
    interests: List[str]
) -> Dict[str, Any]:
    """
    Call Gemini API using raw HTTP requests to generate a structured itinerary.
    If the API Key is missing or request fails, falls back to get_fallback_itinerary.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key or gemini_key == "YOUR_GEMINI_API_KEY":
        logger.warning("GEMINI_API_KEY is not configured or holds placeholder value. Using fallback generator.")
        # Calculate duration days
        try:
            from datetime import datetime
            d1 = datetime.strptime(start_date, "%Y-%m-%d")
            d2 = datetime.strptime(end_date, "%Y-%m-%d")
            duration_days = max(1, (d2 - d1).days + 1)
        except Exception:
            duration_days = 3
        return get_fallback_itinerary(destination, duration_days, budget, travel_style, interests)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
    
    # Calculate duration
    try:
        from datetime import datetime
        d1 = datetime.strptime(start_date, "%Y-%m-%d")
        d2 = datetime.strptime(end_date, "%Y-%m-%d")
        duration_days = max(1, (d2 - d1).days + 1)
    except Exception:
        duration_days = 3

    prompt = (
        f"Create a travel itinerary for a {duration_days}-day trip to '{destination}' "
        f"starting on {start_date} and ending on {end_date}. "
        f"Departure location is '{departure_location or 'N/A'}'. "
        f"Total budget is {budget} USD. "
        f"Travel style is '{travel_style or 'General'}'. "
        f"User interests: {', '.join(interests) if interests else 'General sightseeing'}. "
        "Please provide a realistic day-by-day plan, estimated expense breakdown "
        "conforming to the total budget, and practical travel tips."
    )

    schema = {
        "type": "OBJECT",
        "properties": {
            "itinerary": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "day": {"type": "INTEGER"},
                        "title": {"type": "STRING"},
                        "activities": {
                            "type": "ARRAY",
                            "items": {
                                "type": "OBJECT",
                                "properties": {
                                    "time": {"type": "STRING", "description": "e.g. 09:00 AM, 02:30 PM"},
                                    "activity": {"type": "STRING"},
                                    "description": {"type": "STRING"},
                                    "location": {"type": "STRING"},
                                    "cost": {"type": "NUMBER", "description": "cost in USD"}
                                },
                                "required": ["time", "activity", "description", "location", "cost"]
                            }
                        }
                    },
                    "required": ["day", "title", "activities"]
                }
            },
            "budget_breakdown": {
                "type": "OBJECT",
                "properties": {
                    "transportation": {"type": "NUMBER"},
                    "accommodation": {"type": "NUMBER"},
                    "food": {"type": "NUMBER"},
                    "activities": {"type": "NUMBER"},
                    "miscellaneous": {"type": "NUMBER"},
                    "total_estimated": {"type": "NUMBER"}
                },
                "required": ["transportation", "accommodation", "food", "activities", "miscellaneous", "total_estimated"]
            },
            "travel_tips": {
                "type": "ARRAY",
                "items": {"type": "STRING"}
            }
        },
        "required": ["itinerary", "budget_breakdown", "travel_tips"]
    }

    payload = {
        "systemInstruction": {
            "parts": [{"text": SYSTEM_INSTRUCTION}]
        },
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseSchema": schema
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Extract content text
            content_text = data["candidates"][0]["content"]["parts"][0]["text"]
            result = json.loads(content_text)
            return result
    except Exception as e:
        logger.error(f"Gemini API request failed: {str(e)}. Falling back to mock generator.")
        return get_fallback_itinerary(destination, duration_days, budget, travel_style, interests)
