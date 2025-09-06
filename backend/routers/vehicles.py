from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, and_, or_
from typing import List, Optional
from uuid import UUID
from database import get_session
from auth import get_current_staff
from models import Vehicle, VehicleStatus, Staff
from schemas import VehicleCreate, VehicleUpdate, VehicleResponse, VehicleFilters

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.post("/", response_model=VehicleResponse)
async def create_vehicle(
    vehicle_data: VehicleCreate,
    session: AsyncSession = Depends(get_session),
    current_staff: Staff = Depends(get_current_staff)
):
    """Create a new vehicle (staff only)."""
    vehicle = Vehicle(**vehicle_data.dict())
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    return vehicle


@router.get("/", response_model=List[VehicleResponse])
async def list_vehicles(
    make: Optional[str] = Query(None),
    model: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    price_min: Optional[float] = Query(None),
    price_max: Optional[float] = Query(None),
    status: Optional[VehicleStatus] = Query(None),
    session: AsyncSession = Depends(get_session)
):
    """List vehicles with optional filters."""
    query = select(Vehicle)
    
    # Apply filters
    conditions = []
    if make:
        conditions.append(Vehicle.make.ilike(f"%{make}%"))
    if model:
        conditions.append(Vehicle.model.ilike(f"%{model}%"))
    if year:
        conditions.append(Vehicle.year == year)
    if price_min is not None:
        conditions.append(Vehicle.price >= price_min)
    if price_max is not None:
        conditions.append(Vehicle.price <= price_max)
    if status:
        conditions.append(Vehicle.status == status)
    
    if conditions:
        query = query.where(and_(*conditions))
    
    result = await session.exec(query)
    return result.all()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(
    vehicle_id: UUID,
    session: AsyncSession = Depends(get_session)
):
    """Get vehicle details by ID."""
    result = await session.exec(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.first()
    
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(
    vehicle_id: UUID,
    vehicle_data: VehicleUpdate,
    session: AsyncSession = Depends(get_session),
    current_staff: Staff = Depends(get_current_staff)
):
    """Update vehicle (staff only)."""
    result = await session.exec(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.first()
    
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    # Update only provided fields
    update_data = vehicle_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)
    
    session.add(vehicle)
    await session.commit()
    await session.refresh(vehicle)
    
    return vehicle


@router.delete("/{vehicle_id}")
async def delete_vehicle(
    vehicle_id: UUID,
    session: AsyncSession = Depends(get_session),
    current_staff: Staff = Depends(get_current_staff)
):
    """Delete vehicle (staff only)."""
    result = await session.exec(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = result.first()
    
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    await session.delete(vehicle)
    await session.commit()
    
    return {"message": "Vehicle deleted successfully"}
