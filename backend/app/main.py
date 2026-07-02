from dotenv import load_dotenv
load_dotenv()

import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from app.chat_agent import run_chat_turn

app = FastAPI(title="Car Showroom AI Assistant")

BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
INDEX_FILE = STATIC_DIR / "index.html"

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

if (STATIC_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

class ChatRequest(BaseModel):
    question: str

# Global history for PoC single user session.
# In a real app, this should be keyed by a session ID.
global_chat_history = []

@app.get("/")
def root():
    if INDEX_FILE.exists():
        return _serve_index()
    return {"message": "Car Showroom AI Assistant is running."}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/config.js")
def runtime_config():
    supabase_url = os.getenv("VITE_SUPABASE_URL", "")
    supabase_anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "")
    app_url = os.getenv("APP_URL", "")
    payload = (
        "window.__APP_CONFIG__ = {"
        f"supabaseUrl: {supabase_url!r},"
        f"supabaseAnonKey: {supabase_anon_key!r},"
        f"appUrl: {app_url!r}"
        "};"
    )
    return Response(content=payload, media_type="application/javascript", headers={"Cache-Control": "no-store"})


@app.get("/favicon.ico")
def favicon():
    favicon_file = STATIC_DIR / "favicon.ico"
    if favicon_file.exists():
        return FileResponse(favicon_file)
    raise HTTPException(status_code=404, detail="Not Found")

@app.post("/chat")
async def chat_with_bot(request: ChatRequest):
    global global_chat_history
    try:
        reply, new_history = run_chat_turn(request.question, global_chat_history)
        global_chat_history = new_history
        return {"answer": reply}
    except Exception as e:
        return {"error": str(e)}


@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    ignored_prefixes = ("chat", "health", "config.js", "docs", "openapi.json", "redoc")
    if full_path.startswith(ignored_prefixes):
        raise HTTPException(status_code=404, detail="Not Found")
    if INDEX_FILE.exists():
        return _serve_index()
    raise HTTPException(status_code=404, detail="Not Found")


def _serve_index():
    html = INDEX_FILE.read_text(encoding="utf-8")
    config_tag = '<script src="/config.js"></script>'
    if config_tag not in html:
        html = html.replace('</head>', f'    {config_tag}\n  </head>', 1)
    return Response(content=html, media_type="text/html")
