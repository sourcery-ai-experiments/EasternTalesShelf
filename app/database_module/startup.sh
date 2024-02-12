#!/bin/sh

# Sleep for a few seconds to allow ZeroTier to start
sleep 3

# Start Uvicorn with your FastAPI application
uvicorn fastapi_for_library_website:app --host 0.0.0.0 --port 8057
