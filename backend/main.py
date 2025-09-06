from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session, engine
from models import SQLModel
from routers import auth, vehicles, customers, bookings, chat
import asyncio

# Create FastAPI app
app = FastAPI(
    title="AI Receptionist API",
    description="Backend API for AI Receptionist at Car Dealership",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(customers.router)
app.include_router(bookings.router)
app.include_router(chat.router)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    # Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "AI Receptionist API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
