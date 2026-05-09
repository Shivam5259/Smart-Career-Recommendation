from fastapi import FastAPI
import database
from routers import auth, users, skills, careers, recommendations
from fastapi.middleware.cors import CORSMiddleware

# initialize web application
app = FastAPI(title="SmartCareer API", version="1.0.0")

# initialize database, add tables if not available
database.init_db()

# allow frontend to send req to backend (using react)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# These are the different 'folders' or 'sections' of our API.
# connectors, receives frontend request, fastapi maps it accordingly with different routes and routes connects it with our logic
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(skills.router)
app.include_router(careers.router)
app.include_router(recommendations.router)

# homepage
@app.get("/")
def root():
    return {
        "message": "SmartCareer API running",
        "docs": "/docs",
        "version": "1.0.0"
    }