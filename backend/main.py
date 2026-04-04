from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from routes.user_routes import router as user_router
from routes.recipe_routes import router as recipe_router
from routes.step_routes import router as step_router
import os

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WikiCook API")

# CORS - allow frontend to send cookies
origins = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL"),
]

# We filter out None values in case FRONTEND_URL isn't set
origins = [o for o in origins if o is not None]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(user_router)
app.include_router(recipe_router)
app.include_router(step_router)


