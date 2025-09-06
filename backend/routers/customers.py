from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, or_
from typing import List
from uuid import UUID
from database import get_session
from models import Customer, Booking
from schemas import CustomerCreate, CustomerResponse, CustomerWithBookings

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("/", response_model=CustomerResponse)
async def create_customer(
    customer_data: CustomerCreate,
    session: AsyncSession = Depends(get_session)
):
    """Create a new customer or return existing one (match by phone/email)."""
    # Check if customer already exists by phone or email
    conditions = [Customer.phone == customer_data.phone]
    if customer_data.email:
        conditions.append(Customer.email == customer_data.email)
    
    result = await session.exec(select(Customer).where(or_(*conditions)))
    existing_customer = result.first()
    
    if existing_customer:
        return existing_customer
    
    # Create new customer
    customer = Customer(**customer_data.dict())
    session.add(customer)
    await session.commit()
    await session.refresh(customer)
    
    return customer


@router.get("/{customer_id}", response_model=CustomerWithBookings)
async def get_customer(
    customer_id: UUID,
    session: AsyncSession = Depends(get_session)
):
    """Get customer details with booking history."""
    result = await session.exec(select(Customer).where(Customer.id == customer_id))
    customer = result.first()
    
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    # Get customer's bookings
    bookings_result = await session.exec(
        select(Booking).where(Booking.customer_id == customer_id)
    )
    bookings = bookings_result.all()
    
    return CustomerWithBookings(
        id=customer.id,
        name=customer.name,
        phone=customer.phone,
        email=customer.email,
        created_at=customer.created_at,
        bookings=bookings
    )
