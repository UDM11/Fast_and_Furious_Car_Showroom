from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from database import get_session
from auth import login_for_access_token, get_current_staff, get_password_hash
from models import Staff, StaffRole
from schemas import LoginRequest, Token, StaffCreate, StaffResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    session: AsyncSession = Depends(get_session)
):
    """Login endpoint for staff members."""
    return await login_for_access_token(login_data, session)


@router.post("/staff", response_model=StaffResponse)
async def create_staff(
    staff_data: StaffCreate,
    session: AsyncSession = Depends(get_session),
    current_staff: Staff = Depends(get_current_staff)
):
    """Create a new staff member (admin only)."""
    if current_staff.role != StaffRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can create staff members"
        )
    
    # Check if email already exists
    result = await session.exec(select(Staff).where(Staff.email == staff_data.email))
    existing_staff = result.first()
    if existing_staff:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new staff member
    staff = Staff(
        name=staff_data.name,
        email=staff_data.email,
        role=staff_data.role,
        password_hash=get_password_hash(staff_data.password)
    )
    
    session.add(staff)
    await session.commit()
    await session.refresh(staff)
    
    return StaffResponse(
        id=staff.id,
        name=staff.name,
        email=staff.email,
        role=staff.role
    )


@router.get("/me", response_model=StaffResponse)
async def get_current_user_info(current_staff: Staff = Depends(get_current_staff)):
    """Get current user information."""
    return StaffResponse(
        id=current_staff.id,
        name=current_staff.name,
        email=current_staff.email,
        role=current_staff.role
    )
