FROM python:3.12.10-slim

ARG INSTALL_DEV=false

# Set working directory
WORKDIR /usr/src/app/backend

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies (including curl for health checks)
RUN apt-get update && \
    apt-get install -y --no-install-recommends libmagic1 curl && \
    rm -rf /var/lib/apt/lists/*

# Copy the canonical requirements file first for better caching
COPY requirements.txt /usr/src/app/requirements.txt
COPY requirements-dev.txt /usr/src/app/requirements-dev.txt
COPY pyproject.toml /usr/src/app/pyproject.toml

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r /usr/src/app/requirements.txt && \
    if [ "$INSTALL_DEV" = "true" ]; then pip install -r /usr/src/app/requirements-dev.txt; fi

# Present the container interpreter through the same path used by editor tooling.
RUN ln -s /usr/local /usr/src/app/.venv

# Copy application code
COPY backend/ /usr/src/app/backend/

# Expose port
EXPOSE 3000

# Default command
CMD ["python", "run.py"]
