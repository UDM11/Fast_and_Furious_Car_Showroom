from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum
from sqlalchemy import Column, JSON, Text


class VehicleStatus(str, Enum):
    AVAILABLE = "available"
    RESERVED = "reserved"
    SOLD = "sold"


class BookingType(str, Enum):
    TEST_DRIVE = "test_drive"
    SERVICE = "service"


class BookingStatus(str, Enum):
    SCHEDULED = "scheduled"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class StaffRole(str, Enum):
    ADMIN = "admin"
    SALES = "sales"
    SERVICE = "service"


class Vehicle(SQLModel, table=True):
    __tablename__ = "vehicles"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    make: str = Field(max_length=100)
    model: str = Field(max_length=100)
    year: int = Field(ge=1900, le=2030)
    price: float = Field(ge=0)
    mileage: int = Field(ge=0)
    status: VehicleStatus = Field(default=VehicleStatus.AVAILABLE)
    features: Optional[str] = Field(default=None, sa_column=Column(Text))
    images: Optional[str] = Field(default=None, sa_column=Column(Text))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    bookings: List["Booking"] = Relationship(back_populates="vehicle")


class Customer(SQLModel, table=True):
    __tablename__ = "customers"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=200)
    phone: str = Field(max_length=20)
    email: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    bookings: List["Booking"] = Relationship(back_populates="customer")


class Booking(SQLModel, table=True):
    __tablename__ = "bookings"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    customer_id: UUID = Field(foreign_key="customers.id")
    vehicle_id: Optional[UUID] = Field(default=None, foreign_key="vehicles.id")
    type: BookingType
    scheduled_time: datetime
    status: BookingStatus = Field(default=BookingStatus.SCHEDULED)
    notes: Optional[str] = Field(default=None, max_length=1000)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    customer: Customer = Relationship(back_populates="bookings")
    vehicle: Optional[Vehicle] = Relationship(back_populates="bookings")


class Staff(SQLModel, table=True):
    __tablename__ = "staff"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=200)
    email: str = Field(max_length=255, unique=True)
    role: StaffRole
    password_hash: str = Field(max_length=255)


class Session(SQLModel, table=True):
    __tablename__ = "sessions"
    
    session_id: str = Field(primary_key=True, max_length=255)
    context: Optional[str] = Field(default=None, sa_column=Column(Text))
    last_active: datetime = Field(default_factory=datetime.utcnow)
