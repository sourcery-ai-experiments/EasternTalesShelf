# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables that persist in the container
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libc6-dev && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file into the container and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Flask application into the container
COPY . .

# Set the default command to run the app using Gunicorn on port 80
CMD ["gunicorn", "--bind", "0.0.0.0:80", "--workers", "4", "app:app"]
