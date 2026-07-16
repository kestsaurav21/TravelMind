from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, trips, weather, maps

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(trips.router, prefix="/trips", tags=["trips"])
api_router.include_router(weather.router, prefix="/weather", tags=["weather"])
api_router.include_router(maps.router, prefix="/maps", tags=["maps"])
