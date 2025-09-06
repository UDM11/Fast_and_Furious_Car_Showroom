import openai
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from database import settings
from models import Session, Vehicle, BookingType
from datetime import datetime


class ChatService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.openai_api_key)
        self.dealership_name = settings.dealership_name
        self.system_prompt = f"""You are a virtual receptionist for a car dealership called {self.dealership_name}. 
You help with vehicle inquiries, test drive bookings, and service appointments. 
Ask for make, model, year, and preferred time if user wants to book. 
Confirm booking requests clearly and ask if they need further help.
Be friendly, professional, and helpful. Keep responses concise but informative."""

    async def process_message(self, session_id: str, message: str, metadata: Dict[str, Any], db_session: AsyncSession) -> Dict[str, Any]:
        """Process a chat message and return response with intents."""
        
        # Get or create session
        session = await self._get_or_create_session(session_id, db_session)
        
        # Update conversation history
        conversation_history = session.context.get("messages", [])
        conversation_history.append({"role": "user", "content": message})
        
        # Keep only last 6 turns (3 exchanges)
        if len(conversation_history) > 6:
            conversation_history = conversation_history[-6:]
        
        # Prepare messages for OpenAI
        messages = [{"role": "system", "content": self.system_prompt}] + conversation_history
        
        try:
            # Call OpenAI
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )
            
            reply = response.choices[0].message.content
            
            # Add assistant response to history
            conversation_history.append({"role": "assistant", "content": reply})
            
            # Update session
            session.context["messages"] = conversation_history
            session.last_active = datetime.utcnow()
            db_session.add(session)
            await db_session.commit()
            
            # Analyze intents
            intents = self._analyze_intents(message, reply)
            suggested_actions = self._get_suggested_actions(intents)
            
            return {
                "reply": reply,
                "intents": intents,
                "suggested_actions": suggested_actions
            }
            
        except Exception as e:
            return {
                "reply": "I apologize, but I'm having trouble processing your request right now. Please try again later.",
                "intents": ["error"],
                "suggested_actions": ["contact_support"]
            }

    async def _get_or_create_session(self, session_id: str, db_session: AsyncSession) -> Session:
        """Get existing session or create new one."""
        result = await db_session.exec(select(Session).where(Session.session_id == session_id))
        session = result.first()
        
        if not session:
            session = Session(
                session_id=session_id,
                context={"messages": []},
                last_active=datetime.utcnow()
            )
            db_session.add(session)
            await db_session.commit()
            await db_session.refresh(session)
        
        return session

    def _analyze_intents(self, user_message: str, assistant_reply: str) -> List[str]:
        """Analyze user message and assistant reply to determine intents."""
        intents = []
        message_lower = user_message.lower()
        reply_lower = assistant_reply.lower()
        
        # Check for inquiry intent
        inquiry_keywords = ["price", "cost", "available", "inventory", "car", "vehicle", "model", "make", "year"]
        if any(keyword in message_lower for keyword in inquiry_keywords):
            intents.append("inquiry")
        
        # Check for test drive booking intent
        test_drive_keywords = ["test drive", "drive", "test", "try", "experience"]
        if any(keyword in message_lower for keyword in test_drive_keywords):
            intents.append("book_test_drive")
        
        # Check for service booking intent
        service_keywords = ["service", "maintenance", "repair", "fix", "appointment"]
        if any(keyword in message_lower for keyword in service_keywords):
            intents.append("book_service")
        
        # If no specific intents found, default to inquiry
        if not intents:
            intents.append("inquiry")
        
        return intents

    def _get_suggested_actions(self, intents: List[str]) -> List[str]:
        """Get suggested actions based on intents."""
        actions = []
        
        if "book_test_drive" in intents:
            actions.extend(["view_vehicles", "book_test_drive"])
        elif "book_service" in intents:
            actions.extend(["book_service", "contact_service"])
        elif "inquiry" in intents:
            actions.extend(["view_vehicles", "contact_sales"])
        
        return actions


# Global chat service instance
chat_service = ChatService()
