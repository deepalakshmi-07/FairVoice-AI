from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

app = FastAPI(title="AI Model API")

# Add CORS middleware
origins = [
    "http://127.0.0.1:5500",  # For Live Server in VS Code
    "http://localhost:5500"   # Also allow localhost if used
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Only allow these frontend origins
    allow_credentials=True,
    allow_methods=["*"],        # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],        # Allow all headers
)

# Include your routes
# app.include_router(router, prefix="/api")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "AI Model API is running"}






