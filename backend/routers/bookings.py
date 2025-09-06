from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, and_
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from database import get_session
from auth import get_current_staff
from models import Booking, Customer, Vehicle, BookingType, BookingStatus, VehicleStatus, Staff
from schemas import BookingCreate, BookingUpdate, BookingResponse, BookingWithDetails, BookingFilters
from email_service import email_service

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    session: AsyncSession = Depends(get_session)
):
    """Create a new booking."""
    # Validate customer exists
    customer_result = await session.exec(select(Customer).where(Customer.id == booking_data.customer_id))
    customer = customer_result.first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    # Validate vehicle exists and is available for test drives
    vehicle = None
    if booking_data.vehicle_id:
        vehicle_result = await session.exec(select(Vehicle).where(Vehicle.id == booking_data.vehicle_id))
        vehicle = vehicle_result.first()
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found"
            )
        
        # Check if vehicle is available for test drive
        if booking_data.type == BookingType.TEST_DRIVE and vehicle.status != VehicleStatus.AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Vehicle is not available for test drive"
            )
    
    # Check for double booking (same time slot)
    existing_booking = await session.exec(
        select(Booking).where(
            and_(
                Booking.scheduled_time == booking_data.scheduled_time,
                Booking.status == BookingStatus.SCHEDULED
            )
        )
    )
    if existing_booking.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Time slot already booked"
        )
    
    # Create booking
    booking = Booking(**booking_data.dict())
    session.add(booking)
    
    # Update vehicle status if test drive
    if booking_data.type == BookingType.TEST_DRIVE and vehicle:
        vehicle.status = VehicleStatus.RESERVED
        session.add(vehicle)
    
    await session.commit()
    await session.refresh(booking)
    
    # Send confirmation email
    await email_service.send_booking_confirmation(booking, customer, vehicle)
    
    return booking


@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: UUID,
    booking_data: BookingUpdate,
    session: AsyncSession = Depends(get_session),
    current_staff: Staff = Depends(get_current_staff)
):
    """Update booking (staff only)."""
    result = await session.exec(select(Booking).where(Booking.id == booking_id))
    booking = result.first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Handle vehicle status changes
    if booking_data.status == BookingStatus.CANCELLED and booking.status != BookingStatus.CANCELLED:
        # Free the vehicle if cancelling
        if booking.vehicle_id:
            vehicle_result = await session.exec(select(Vehicle).where(Vehicle.id == booking.vehicle_id))
            vehicle = vehicle_result.first()
            if vehicle and vehicle.status == VehicleStatus.RESERVED:
                vehicle.status = VehicleStatus.AVAILABLE
                session.add(vehicle)
    
    # Update booking fields
    update_data = booking_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(booking, field, value)
    
    session.add(booking)
    await session.commit()
    await session.refresh(booking)
    
    return booking


@router.get("/", response_model=List[BookingWithDetails])
async def list_bookings(
    type: Optional[BookingType] = Query(None),
    status: Optional[BookingStatus] = Query(None),
    customer_id: Optional[UUID] = Query(None),
    session: AsyncSession = Depends(get_session)
):
    """List bookings with optional filters."""
    query = select(Booking)
    
    # Apply filters
    conditions = []
    if type:
        conditions.append(Booking.type == type)
    if status:
        conditions.append(Booking.status == status)
    if customer_id:
        conditions.append(Booking.customer_id == customer_id)
    
    if conditions:
        query = query.where(and_(*conditions))
    
    result = await session.exec(query)
    bookings = result.all()
    
    # Load related data
    booking_details = []
    for booking in bookings:
        # Get customer
        customer_result = await session.exec(select(Customer).where(Customer.id == booking.customer_id))
        customer = customer_result.first()
        
        # Get vehicle if exists
        vehicle = None
        if booking.vehicle_id:
            vehicle_result = await session.exec(select(Vehicle).where(Vehicle.id == booking.vehicle_id))
            vehicle = vehicle_result.first()
        
        booking_details.append(BookingWithDetails(
            id=booking.id,
            customer_id=booking.customer_id,
            vehicle_id=booking.vehicle_id,
            type=booking.type,
            scheduled_time=booking.scheduled_time,
            status=booking.status,
            notes=booking.notes,
            created_at=booking.created_at,
            customer=customer,
            vehicle=vehicle
        ))
    
    return booking_details


@router.get("/{booking_id}", response_model=BookingWithDetails)
async def get_booking(
    booking_id: UUID,
    session: AsyncSession = Depends(get_session)
):
    """Get booking details by ID."""
    result = await session.exec(select(Booking).where(Booking.id == booking_id))
    booking = result.first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Get customer
    customer_result = await session.exec(select(Customer).where(Customer.id == booking.customer_id))
    customer = customer_result.first()
    
    # Get vehicle if exists
    vehicle = None
    if booking.vehicle_id:
        vehicle_result = await session.exec(select(Vehicle).where(Vehicle.id == booking.vehicle_id))
        vehicle = vehicle_result.first()
    
    return BookingWithDetails(
        id=booking.id,
        customer_id=booking.customer_id,
        vehicle_id=booking.vehicle_id,
        type=booking.type,
        scheduled_time=booking.scheduled_time,
        status=booking.status,
        notes=booking.notes,
        created_at=booking.created_at,
        customer=customer,
        vehicle=vehicle
    )
