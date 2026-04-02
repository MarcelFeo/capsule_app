import os #teste
from fastapi import FastAPI
from app.infrastructure.database.connection import Base, engine
from app.use_cases.user import users
from app.use_cases.patient import patients
from app.use_cases.caregiver import caregivers
from app.use_cases.auth import router as auth_router

if os.environ.get("ENVIRONMENT") != "testing": #teste
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="Capsule API", version="1.0.0")

app.include_router(auth_router.router)
app.include_router(users.router)
app.include_router(patients.router)
app.include_router(caregivers.router)