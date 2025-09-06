#!/usr/bin/env python3
"""
Database initialization script.
Creates initial admin user and sample data for development.
"""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from database import async_session, settings
from models import Staff, Customer, Vehicle, StaffRole, VehicleStatus
from auth import get_password_hash


async def create_admin_user(session: AsyncSession):
    """Create initial admin user."""
    # Check if admin already exists
    result = await session.exec(select(Staff).where(Staff.email == "admin@dealership.com"))
    existing_admin = result.first()
    
    if existing_admin:
        print("Admin user already exists")
        return existing_admin
    
    admin = Staff(
        name="Admin User",
        email="admin@dealership.com",
        role=StaffRole.ADMIN,
        password_hash=get_password_hash("admin123")
    )
    
    session.add(admin)
    await session.commit()
    await session.refresh(admin)
    
    print("Admin user created:")
    print("  Email: admin@dealership.com")
    print("  Password: admin123")
    
    return admin


async def create_sample_data(session: AsyncSession):
    """Create sample vehicles and customers."""
    
    # Create sample vehicles
    vehicles_data = [
        {
            "make": "Toyota",
            "model": "Camry",
            "year": 2023,
            "price": 25000.0,
            "mileage": 15000,
            "features": {"color": "blue", "transmission": "automatic", "fuel_type": "hybrid"},
            "images": ["camry_front.jpg", "camry_interior.jpg"]
        },
        {
            "make": "Honda",
            "model": "Civic",
            "year": 2022,
            "price": 22000.0,
            "mileage": 25000,
            "features": {"color": "white", "transmission": "manual", "fuel_type": "gasoline"},
            "images": ["civic_front.jpg", "civic_side.jpg"]
        },
        {
            "make": "Ford",
            "model": "F-150",
            "year": 2023,
            "price": 45000.0,
            "mileage": 8000,
            "features": {"color": "black", "transmission": "automatic", "fuel_type": "gasoline", "towing_capacity": "11000"},
            "images": ["f150_front.jpg", "f150_bed.jpg"]
        }
    ]
    
    vehicles = []
    for vehicle_data in vehicles_data:
        vehicle = Vehicle(**vehicle_data)
        session.add(vehicle)
        vehicles.append(vehicle)
    
    # Create sample customers
    customers_data = [
        {
            "name": "John Smith",
            "phone": "+1234567890",
            "email": "john.smith@email.com"
        },
        {
            "name": "Sarah Johnson",
            "phone": "+1987654321",
            "email": "sarah.johnson@email.com"
        },
        {
            "name": "Mike Wilson",
            "phone": "+1555123456",
            "email": "mike.wilson@email.com"
        }
    ]
    
    customers = []
    for customer_data in customers_data:
        customer = Customer(**customer_data)
        session.add(customer)
        customers.append(customer)
    
    await session.commit()
    
    print(f"Created {len(vehicles)} sample vehicles")
    print(f"Created {len(customers)} sample customers")
    
    return vehicles, customers


async def main():
    """Main initialization function."""
    print("Initializing database...")
    
    async with async_session() as session:
        # Create admin user
        admin = await create_admin_user(session)
        
        # Create sample data
        vehicles, customers = await create_sample_data(session)
        
        print("\nSample data created successfully!")
        print("\nYou can now:")
        print("1. Login with admin@dealership.com / admin123")
        print("2. View vehicles at GET /vehicles/")
        print("3. Create customers at POST /customers/")
        print("4. Test the chat at POST /chat/")


if __name__ == "__main__":
    asyncio.run(main())
