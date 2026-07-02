from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.chat_agent import run_chat_turn

app = FastAPI(title="Car Showroom AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str

# Global history for PoC single user session.
# In a real app, this should be keyed by a session ID.
global_chat_history = []

@app.get("/")
def root():
    return {"message": "Car Showroom AI Assistant is running."}

@app.post("/chat")
async def chat_with_bot(request: ChatRequest):
    global global_chat_history
    try:
        reply, new_history = run_chat_turn(request.question, global_chat_history)
        global_chat_history = new_history
        return {"answer": reply}
    except Exception as e:
        return {"error": str(e)}
