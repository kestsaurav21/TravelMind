from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.api import api_router

# Import models so that Base.metadata knows about them
import app.models  # noqa

# Create tables on startup (commented out in favor of Alembic migrations)
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for AI Travel Planner application using FastAPI and PostgreSQL",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers conforming to Engineering Guidelines error format
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": str(exc.detail)},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = exc.errors()
    error_messages = []
    for err in errors:
        loc = " -> ".join(str(l) for l in err["loc"])
        error_messages.append(f"{loc}: {err['msg']}")
    message = " | ".join(error_messages)
    return JSONResponse(
        status_code=422,
        content={"success": False, "message": message},
    )

# Mount Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root() -> dict:
    return {
        "status": "healthy",
        "message": "Welcome to the AI Travel Planner API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
