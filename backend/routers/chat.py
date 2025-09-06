from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_session
from chat_service import chat_service
from schemas import ChatMessage, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat(
    message: ChatMessage,
    session: AsyncSession = Depends(get_session)
):
    """Process chat message and return AI response."""
    response_data = await chat_service.process_message(
        session_id=message.session_id,
        message=message.message,
        metadata=message.metadata or {},
        db_session=session
    )
    
    return ChatResponse(**response_data)
