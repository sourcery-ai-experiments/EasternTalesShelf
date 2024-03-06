FROM alpine:3.17.3

# Update package list and install dependencies
RUN apk update && \
    apk add --no-cache bash python3 py3-pip curl iptables iproute2 openrc && \
    apk add build-base python3-dev libffi-dev

# Ensure openrc can run in Docker
RUN mkdir -p /run/openrc && \
    touch /run/openrc/softlevel

# Add the edge repository for Tailscale
# Install Tailscale from the edge testing repository
RUN echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    echo "@edge http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
    apk add --no-cache tailscale@edge

# Copy your FastAPI application and other necessary files
COPY ./app /app

# Set the working directory and install Python dependencies
WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Prepare and use the startup script
COPY startup.sh /startup.sh
RUN chmod +x /startup.sh
ENTRYPOINT ["/startup.sh"]
