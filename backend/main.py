from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine, Base
from routes.user_routes import router as user_router
from routes.recipe_routes import router as recipe_router

# Create all tables in the database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WikiCook API")

# CORS - allow frontend to send cookies
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(user_router)
app.include_router(recipe_router)


