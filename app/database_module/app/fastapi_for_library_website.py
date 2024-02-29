import logging
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess
from datetime import datetime

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Create a logger object
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://10.147.17.21"],  # Update this to the specific origins you want to allow or "*" for all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/sync")
async def run_script():
    current_time = datetime.now()  # Get the current date and time
    logger.info(f"---Running script at {current_time}---")  # Log the date and time
    try:
        subprocess.run(["python", "update_only_manga.py"], check=True)
        logger.info(f"---Update Script executed successfully at {current_time}---")

        subprocess.run(["python", "update_favorites.py"], check=True)
        logger.info(f"---Favorites update Script executed successfully at {current_time}---")

        return {"status": "success", "message": "Script executed successfully"}
    except subprocess.CalledProcessError as e:
        logger.error(f"---Script execution failed at {current_time}---")
        logger.error(str(e))
        logger.error(traceback.format_exc())  # Log the full traceback
        return {"status": "failed", "message": "Script failed"}

# Optional: Add more routes as needed
