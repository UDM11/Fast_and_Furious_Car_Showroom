import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
import os
from uuid import uuid4
from datetime import datetime, timedelta

# Import your app and dependencies
from main import app
from database import get_session
from models import Staff, Customer, Vehicle, Booking, StaffRole, VehicleStatus, BookingType, BookingStatus
from auth import get_password_hash, create_access_token
from schemas import StaffCreate

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Create test engine
test_engine = create_async_engine(TEST_DATABASE_URL, echo=True)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine, class_=AsyncSession)


@pytest_asyncio.fixture
async def test_session():
    """Create test database session."""
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    async with TestSessionLocal() as session:
        yield session
    
    async with test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


@pytest_asyncio.fixture
async def client(test_session):
    """Create test client with dependency override."""
    def override_get_session():
        return test_session
    
    app.dependency_overrides[get_session] = override_get_session
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def admin_staff(test_session):
    """Create admin staff member for testing."""
    staff = Staff(
        name="Admin User",
        email="admin@test.com",
        role=StaffRole.ADMIN,
        password_hash=get_password_hash("password123")
    )
    test_session.add(staff)
    await test_session.commit()
    await test_session.refresh(staff)
    return staff


@pytest_asyncio.fixture
async def sales_staff(test_session):
    """Create sales staff member for testing."""
    staff = Staff(
        name="Sales User",
        email="sales@test.com",
        role=StaffRole.SALES,
        password_hash=get_password_hash("password123")
    )
    test_session.add(staff)
    await test_session.commit()
    await test_session.refresh(staff)
    return staff


@pytest_asyncio.fixture
async def test_customer(test_session):
    """Create test customer."""
    customer = Customer(
        name="John Doe",
        phone="+1234567890",
        email="john@example.com"
    )
    test_session.add(customer)
    await test_session.commit()
    await test_session.refresh(customer)
    return customer


@pytest_asyncio.fixture
async def test_vehicle(test_session):
    """Create test vehicle."""
    vehicle = Vehicle(
        make="Toyota",
        model="Camry",
        year=2023,
        price=25000.0,
        mileage=15000,
        status=VehicleStatus.AVAILABLE,
        features={"color": "blue", "transmission": "automatic"},
        images=["image1.jpg", "image2.jpg"]
    )
    test_session.add(vehicle)
    await test_session.commit()
    await test_session.refresh(vehicle)
    return vehicle


class TestAuth:
    """Test authentication endpoints."""
    
    async def test_login_success(self, client, admin_staff):
        """Test successful login."""
        response = await client.post("/auth/login", json={
            "email": "admin@test.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    async def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials."""
        response = await client.post("/auth/login", json={
            "email": "admin@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
    
    async def test_protected_endpoint_without_token(self, client):
        """Test accessing protected endpoint without token."""
        response = await client.get("/auth/me")
        assert response.status_code == 401
    
    async def test_protected_endpoint_with_token(self, client, admin_staff):
        """Test accessing protected endpoint with valid token."""
        token = create_access_token({"sub": str(admin_staff.id)})
        headers = {"Authorization": f"Bearer {token}"}
        response = await client.get("/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "admin@test.com"


class TestVehicles:
    """Test vehicle endpoints."""
    
    async def test_create_vehicle_unauthorized(self, client):
        """Test creating vehicle without authentication."""
        response = await client.post("/vehicles/", json={
            "make": "Toyota",
            "model": "Camry",
            "year": 2023,
            "price": 25000.0,
            "mileage": 15000
        })
        assert response.status_code == 401
    
    async def test_create_vehicle_authorized(self, client, admin_staff):
        """Test creating vehicle with authentication."""
        token = create_access_token({"sub": str(admin_staff.id)})
        headers = {"Authorization": f"Bearer {token}"}
        
        response = await client.post("/vehicles/", json={
            "make": "Toyota",
            "model": "Camry",
            "year": 2023,
            "price": 25000.0,
            "mileage": 15000
        }, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["make"] == "Toyota"
        assert data["model"] == "Camry"
    
    async def test_list_vehicles(self, client, test_vehicle):
        """Test listing vehicles."""
        response = await client.get("/vehicles/")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["make"] == "Toyota"
    
    async def test_get_vehicle(self, client, test_vehicle):
        """Test getting specific vehicle."""
        response = await client.get(f"/vehicles/{test_vehicle.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["make"] == "Toyota"
    
    async def test_get_vehicle_not_found(self, client):
        """Test getting non-existent vehicle."""
        fake_id = str(uuid4())
        response = await client.get(f"/vehicles/{fake_id}")
        assert response.status_code == 404


class TestCustomers:
    """Test customer endpoints."""
    
    async def test_create_customer(self, client):
        """Test creating customer."""
        response = await client.post("/customers/", json={
            "name": "John Doe",
            "phone": "+1234567890",
            "email": "john@example.com"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "John Doe"
        assert data["phone"] == "+1234567890"
    
    async def test_create_existing_customer(self, client, test_customer):
        """Test creating customer with existing phone/email."""
        response = await client.post("/customers/", json={
            "name": "John Doe",
            "phone": "+1234567890",
            "email": "john@example.com"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(test_customer.id)  # Should return existing customer
    
    async def test_get_customer(self, client, test_customer):
        """Test getting customer details."""
        response = await client.get(f"/customers/{test_customer.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "John Doe"
        assert "bookings" in data


class TestBookings:
    """Test booking endpoints."""
    
    async def test_create_test_drive_booking(self, client, test_customer, test_vehicle):
        """Test creating test drive booking."""
        response = await client.post("/bookings/", json={
            "customer_id": str(test_customer.id),
            "vehicle_id": str(test_vehicle.id),
            "type": "test_drive",
            "scheduled_time": (datetime.now() + timedelta(days=1)).isoformat(),
            "notes": "Test drive request"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "test_drive"
        assert data["customer_id"] == str(test_customer.id)
    
    async def test_create_service_booking(self, client, test_customer):
        """Test creating service booking."""
        response = await client.post("/bookings/", json={
            "customer_id": str(test_customer.id),
            "type": "service",
            "scheduled_time": (datetime.now() + timedelta(days=1)).isoformat(),
            "notes": "Oil change"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "service"
    
    async def test_double_booking_prevention(self, client, test_customer, test_vehicle):
        """Test that double booking is prevented."""
        scheduled_time = (datetime.now() + timedelta(days=1)).isoformat()
        
        # Create first booking
        response1 = await client.post("/bookings/", json={
            "customer_id": str(test_customer.id),
            "vehicle_id": str(test_vehicle.id),
            "type": "test_drive",
            "scheduled_time": scheduled_time
        })
        assert response1.status_code == 200
        
        # Try to create second booking at same time
        response2 = await client.post("/bookings/", json={
            "customer_id": str(test_customer.id),
            "vehicle_id": str(test_vehicle.id),
            "type": "test_drive",
            "scheduled_time": scheduled_time
        })
        assert response2.status_code == 409  # Conflict
    
    async def test_vehicle_unavailable_for_test_drive(self, client, test_customer, test_vehicle):
        """Test booking test drive for unavailable vehicle."""
        # Mark vehicle as sold
        test_vehicle.status = VehicleStatus.SOLD
        await test_vehicle.save()
        
        response = await client.post("/bookings/", json={
            "customer_id": str(test_customer.id),
            "vehicle_id": str(test_vehicle.id),
            "type": "test_drive",
            "scheduled_time": (datetime.now() + timedelta(days=1)).isoformat()
        })
        assert response.status_code == 409  # Conflict


class TestChat:
    """Test chat endpoint."""
    
    @patch('chat_service.chat_service.client')
    async def test_chat_endpoint(self, mock_openai_client, client):
        """Test chat endpoint with mocked OpenAI."""
        # Mock OpenAI response
        mock_response = AsyncMock()
        mock_response.choices = [AsyncMock()]
        mock_response.choices[0].message.content = "Hello! How can I help you today?"
        mock_openai_client.chat.completions.create.return_value = mock_response
        
        response = await client.post("/chat/", json={
            "session_id": "test-session-123",
            "message": "Hello",
            "metadata": {}
        })
        assert response.status_code == 200
        data = response.json()
        assert "reply" in data
        assert "intents" in data
        assert "suggested_actions" in data
        assert data["reply"] == "Hello! How can I help you today?"
