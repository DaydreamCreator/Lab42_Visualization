FROM python:3.10-slim

WORKDIR /app

# install system dependencies (if needed)
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# copy dependency files
COPY requirements.txt .

# install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy application code
COPY . .

EXPOSE 5000

# use gunicorn to run (production environment)
CMD ["python", "app.py"]