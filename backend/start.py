#!/usr/bin/env python3
"""
Startup script for the AI Receptionist backend.
Handles database setup and starts the server.
"""

import subprocess
import sys
import os
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e.stderr}")
        return False


def check_requirements():
    """Check if required tools are installed."""
    print("🔍 Checking requirements...")
    
    # Check Python version
    if sys.version_info < (3, 11):
        print("❌ Python 3.11+ is required")
        return False
    
    # Check if PostgreSQL is available
    if not run_command("psql --version", "Checking PostgreSQL"):
        print("❌ PostgreSQL is not installed or not in PATH")
        return False
    
    print("✅ All requirements met")
    return True


def setup_database():
    """Set up the database."""
    print("🗄️ Setting up database...")
    
    # Check if .env exists
    if not os.path.exists(".env"):
        print("❌ .env file not found. Please copy env.example to .env and configure it.")
        return False
    
    # Run migrations
    if not run_command("alembic upgrade head", "Running database migrations"):
        return False
    
    return True


def start_server():
    """Start the FastAPI server."""
    print("🚀 Starting server...")
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "8000"
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")


def main():
    """Main startup function."""
    print("🤖 AI Receptionist Backend Startup")
    print("=" * 40)
    
    # Change to backend directory
    backend_dir = Path(__file__).parent
    os.chdir(backend_dir)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Setup database
    if not setup_database():
        sys.exit(1)
    
    # Initialize sample data
    print("🔄 Initializing sample data...")
    try:
        subprocess.run([sys.executable, "init_db.py"], check=True)
        print("✅ Sample data initialized")
    except subprocess.CalledProcessError:
        print("⚠️ Sample data initialization failed (this is optional)")
    
    # Start server
    start_server()


if __name__ == "__main__":
    main()
