from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID
from models import VehicleStatus, BookingType, BookingStatus, StaffRole


# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# Vehicle schemas
class VehicleCreate(BaseModel):
    make: str
    model: str
    year: int
    price: float
    mileage: int
    features: Dict[str, Any] = {}
    images: List[str] = []


class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[float] = None
    mileage: Optional[int] = None
    status: Optional[VehicleStatus] = None
    features: Optional[Dict[str, Any]] = None
    images: Optional[List[str]] = None


class VehicleResponse(BaseModel):
    id: UUID
    make: str
    model: str
    year: int
    price: float
    mileage: int
    status: VehicleStatus
    features: Dict[str, Any]
    images: List[str]
    created_at: datetime


# Customer schemas
class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None


class CustomerResponse(BaseModel):
    id: UUID
    name: str
    phone: str
    email: Optional[str]
    created_at: datetime


class CustomerWithBookings(CustomerResponse):
    bookings: List["BookingResponse"]


# Booking schemas
class BookingCreate(BaseModel):
    customer_id: UUID
    vehicle_id: Optional[UUID] = None
    type: BookingType
    scheduled_time: datetime
    notes: Optional[str] = None


class BookingUpdate(BaseModel):
    scheduled_time: Optional[datetime] = None
    status: Optional[BookingStatus] = None
    notes: Optional[str] = None


class BookingResponse(BaseModel):
    id: UUID
    customer_id: UUID
    vehicle_id: Optional[UUID]
    type: BookingType
    scheduled_time: datetime
    status: BookingStatus
    notes: Optional[str]
    created_at: datetime


class BookingWithDetails(BookingResponse):
    customer: CustomerResponse
    vehicle: Optional[VehicleResponse]


# Chat schemas
class ChatMessage(BaseModel):
    session_id: str
    message: str
    metadata: Optional[Dict[str, Any]] = {}


class ChatResponse(BaseModel):
    reply: str
    intents: List[str]
    suggested_actions: List[str]


# Staff schemas
class StaffCreate(BaseModel):
    name: str
    email: EmailStr
    role: StaffRole
    password: str


class StaffResponse(BaseModel):
    id: UUID
    name: str
    email: str
    role: StaffRole


# Vehicle filters
class VehicleFilters(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    status: Optional[VehicleStatus] = None


# Booking filters
class BookingFilters(BaseModel):
    type: Optional[BookingType] = None
    status: Optional[BookingStatus] = None
    customer_id: Optional[UUID] = None
