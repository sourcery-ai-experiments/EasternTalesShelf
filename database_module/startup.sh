#!/bin/sh

# Start ZeroTier in the background
zerotier-one &

# Sleep for a few seconds to allow ZeroTier to start
sleep 3

# Join the ZeroTier network using the environment variable
zerotier-cli join $NETWORK_NUMBER

# Start Uvicorn with your FastAPI application
uvicorn fastapi_for_library_website:app --host 10.147.17.146 --port 8057
