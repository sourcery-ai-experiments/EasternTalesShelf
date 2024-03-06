#!/bin/sh

# Start the Tailscale daemon in the background
tailscaled &

# Wait for a few seconds to ensure tailscaled is up
sleep 3

# Connect to Tailscale as an ephemeral node
tailscale up --authkey ${OAUTH_CLIENT_SECRET}

# Start your application
uvicorn fastapi_for_library_website:app --host 0.0.0.0 --port 8057
