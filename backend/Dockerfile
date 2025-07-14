FROM python:3.11-slim

# System dependencies
RUN apt-get update && apt-get install -y \
    gcc g++ cmake git curl ffmpeg libgl1 libglib2.0-0 libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create local cache folders and ensure they're writable
RUN mkdir -p /app/hf_cache/mpl && \
    chmod -R 777 /app/hf_cache

# Set env vars to force cache to writable directories
ENV TRANSFORMERS_CACHE=/app/hf_cache
ENV HF_HOME=/app/hf_cache
ENV XDG_CACHE_HOME=/app/hf_cache
ENV DIFFUSERS_CACHE=/app/hf_cache
ENV TORCH_HOME=/app/hf_cache
ENV MPLCONFIGDIR=/app/hf_cache/mpl

# Copy code
COPY . .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose the port used by FastAPI
EXPOSE 7860

# Set environment variable for Hugging Face Spaces
ENV PORT 7860

# Run FastAPI using uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
