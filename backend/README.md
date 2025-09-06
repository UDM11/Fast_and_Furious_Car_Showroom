# AI Receptionist Backend

A FastAPI-based backend for an AI Receptionist system designed for car dealerships. This system handles vehicle inventory, customer management, booking appointments, and provides an AI-powered chat interface.

## Features

- **Authentication**: JWT-based authentication for staff members
- **Vehicle Management**: CRUD operations for vehicle inventory
- **Customer Management**: Customer registration and history tracking
- **Booking System**: Test drive and service appointment booking with conflict prevention
- **AI Chat**: OpenAI-powered chat interface for customer inquiries
- **Email Notifications**: Automated booking confirmation emails
- **Database Migrations**: Alembic for database schema management

## Tech Stack

- **Python 3.11+**
- **FastAPI** - Modern, fast web framework
- **SQLModel** - SQL database ORM with Pydantic integration
- **PostgreSQL** - Primary database with asyncpg driver
- **Alembic** - Database migration tool
- **JWT** - Authentication tokens
- **OpenAI API** - AI chat functionality
- **Pytest** - Testing framework

## Quick Start

### Prerequisites

- Python 3.11 or higher
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

5. **Set up PostgreSQL database:**
   ```bash
   # Create database
   createdb ai_receptionist
   
   # Run migrations
   alembic upgrade head
   ```

6. **Create initial admin user:**
   ```python
   # Run this Python script to create an admin user
   python -c "
   from database import create_tables
   from models import Staff, StaffRole
   from auth import get_password_hash
   from sqlalchemy.orm import sessionmaker
   from sqlalchemy import create_engine
   from database import settings
   
   create_tables()
   
   engine = create_engine(settings.database_url.replace('+asyncpg', ''))
   SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
   
   session = SessionLocal()
   admin = Staff(
       name='Admin User',
       email='admin@dealership.com',
       role=StaffRole.ADMIN,
       password_hash=get_password_hash('admin123')
   )
   session.add(admin)
   session.commit()
   print('Admin user created: admin@dealership.com / admin123')
   "
   ```

7. **Run the application:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/ai_receptionist
OPENAI_API_KEY=sk-your-openai-api-key-here
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
DEALERSHIP_NAME="Your Dealership Name"
```

## API Endpoints

### Authentication

- `POST /auth/login` - Staff login
- `POST /auth/staff` - Create staff member (admin only)
- `GET /auth/me` - Get current user info

### Vehicles

- `POST /vehicles/` - Create vehicle (staff only)
- `GET /vehicles/` - List vehicles with filters
- `GET /vehicles/{id}` - Get vehicle details
- `PUT /vehicles/{id}` - Update vehicle (staff only)
- `DELETE /vehicles/{id}` - Delete vehicle (staff only)

### Customers

- `POST /customers/` - Create or find existing customer
- `GET /customers/{id}` - Get customer with booking history

### Bookings

- `POST /bookings/` - Create booking
- `PUT /bookings/{id}` - Update booking (staff only)
- `GET /bookings/` - List bookings with filters
- `GET /bookings/{id}` - Get booking details

### Chat

- `POST /chat/` - Send message to AI receptionist

## Example API Usage

### 1. Login as Staff

```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@dealership.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### 2. Create a Vehicle

```bash
curl -X POST "http://localhost:8000/vehicles/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "price": 25000.0,
    "mileage": 15000,
    "features": {
      "color": "blue",
      "transmission": "automatic",
      "fuel_type": "hybrid"
    },
    "images": ["camry_front.jpg", "camry_interior.jpg"]
  }'
```

### 3. Create a Customer

```bash
curl -X POST "http://localhost:8000/customers/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  }'
```

### 4. Book a Test Drive

```bash
curl -X POST "http://localhost:8000/bookings/" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUSTOMER_UUID",
    "vehicle_id": "VEHICLE_UUID",
    "type": "test_drive",
    "scheduled_time": "2024-01-15T14:00:00",
    "notes": "Interested in hybrid features"
  }'
```

### 5. Chat with AI Receptionist

```bash
curl -X POST "http://localhost:8000/chat/" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user-session-123",
    "message": "I am looking for a Toyota Camry under $30,000",
    "metadata": {}
  }'
```

Response:
```json
{
  "reply": "I'd be happy to help you find a Toyota Camry under $30,000! We have several Camry models available in that price range. Would you like to schedule a test drive?",
  "intents": ["inquiry"],
  "suggested_actions": ["view_vehicles", "contact_sales"]
}
```

## Database Migrations

### Create a new migration:
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply migrations:
```bash
alembic upgrade head
```

### Rollback migration:
```bash
alembic downgrade -1
```

## Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_api.py

# Run with verbose output
pytest -v
```

## Business Logic

### Booking Validation

- **Test Drive Bookings**: Vehicle must be available (not reserved or sold)
- **Double Booking Prevention**: No two bookings can be scheduled at the same time
- **Vehicle Status Management**: Test drive bookings automatically reserve vehicles
- **Cancellation Logic**: Cancelling a test drive booking frees the vehicle

### Customer Management

- **Duplicate Prevention**: Customers are matched by phone number or email
- **Booking History**: All customer bookings are tracked and retrievable

### AI Chat Features

- **Session Management**: Conversations are maintained per session
- **Intent Recognition**: System identifies inquiry, booking, and service intents
- **Context Awareness**: Chat remembers last 6 conversation turns
- **Suggested Actions**: Provides relevant next steps based on conversation

## Production Deployment

### Security Considerations

1. **Change JWT Secret**: Use a strong, random secret key
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure appropriate CORS origins
4. **Rate Limiting**: Implement rate limiting for API endpoints
5. **Input Validation**: All inputs are validated using Pydantic

### Environment Setup

1. **Database**: Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. **Email**: Configure production SMTP service
3. **Monitoring**: Add logging and monitoring (e.g., Sentry, DataDog)
4. **Scaling**: Consider using async workers for background tasks

### Docker Deployment (Optional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and credentials are correct
2. **OpenAI API**: Verify API key is valid and has sufficient credits
3. **Email Service**: Check SMTP credentials and firewall settings
4. **Migration Errors**: Ensure database exists and user has proper permissions

### Logs

Enable debug logging by setting the log level in your environment:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.
