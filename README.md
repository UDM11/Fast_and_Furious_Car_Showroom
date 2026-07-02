# 🚗 Fast & Furious Car Showroom

A premium, state-of-the-art web application for a luxury car showroom. The application features an interactive, modern user interface alongside an AI-powered Receptionist chatbot that uses Retrieval-Augmented Generation (RAG) to answer queries using a static PDF document.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React (v18), TypeScript, Vite
* **Styling:** TailwindCSS (v3), PostCSS, Autoprefixer
* **Icons:** Lucide React
* **Animations:** Framer Motion (for premium micro-interactions and transitions)
* **Routing:** React Router DOM (v7)

### Backend
* **Framework:** FastAPI (Python 3.13)
* **AI/RAG Framework:** LangChain & LangChain Community
* **Vector Database:** Chroma DB (local persistent storage)
* **LLM & Embeddings:** OpenAI (`gpt-3.5-turbo` and `OpenAIEmbeddings`)
* **Server:** Uvicorn

---

## 📂 Project Structure

```
F and F Car Showroom/
├── frontend/             # React SPA (Vite + TS + TailwindCSS)
│   ├── src/
│   │   ├── components/   # Shared UI components
│   │   ├── pages/        # Application views (Home, AIReceptionist, Finance, TestDrive, etc.)
│   │   ├── App.tsx       # Routing and layout setup
│   │   └── main.tsx      # Entrypoint
│   └── package.json
│
└── backend/              # FastAPI Server (RAG Chatbot Pipeline)
    ├── app/
    │   ├── main.py       # FastAPI application entrypoint and routes
    │   ├── rag_logic.py  # PDF processing, chunking, and embedding logic
    │   └── chat_logic.py # LangChain chatbot chain construction and retrieval
    ├── chroma_store/     # Persistent Chroma DB vector database files
    ├── sample.pdf        # Document utilized by RAG chatbot
    ├── .env              # Backend environment variables
    └── reqirements.txt   # Python dependencies
```

---

## 🚀 Getting Started

### 1. Backend Setup & Run

#### **Prerequisites**
* Python 3.13 or higher.
* Place a PDF document (e.g. showroom details) at `backend/sample.pdf`.

#### **Installation & Execution**
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Create environment
   python -m venv venv
   
   # Activate environment (Windows PowerShell)
   .\venv\Scripts\Activate.ps1
   
   # Activate environment (Windows CMD)
   .\venv\Scripts\activate
   
   # Activate environment (macOS/Linux)
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r reqirements.txt
   ```
4. Configure the environment variables:
   * Create a `.env` file (copied from `.env.example`).
   * Add your `OPENAI_API_KEY` and Supabase keys.
5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   * The API will run locally at **`http://127.0.0.1:8000`**.
   * Interactive documentation is available at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup & Run

#### **Prerequisites**
* Node.js (v18 or higher) and npm.

#### **Installation & Execution**
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * The website will run locally at **`http://localhost:5173`**.

---

## ✨ Key Features

* **AI Receptionist:** Chat directly with an AI assistant that answers questions specifically utilizing information from the showroom's PDF document.
* **Interactive Showcase:** Dynamic car inventory cards with animations and detail pages.
* **Test Drive Booking:** Functional test drive scheduler.
* **Financial Calculator:** Interactive loan/finance calculators.
* **Smooth UX:** Premium animations, responsive layouts, and modern aesthetics.
