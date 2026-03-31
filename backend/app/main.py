from fastapi import FastAPI
from database import Base, engine
from use_cases.user import users
from use_cases.patient import patients
from use_cases.caregiver import caregivers

# Cria as tabelas automaticamente (em produção use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Capsule API", version="1.0.0")

app.include_router(users.router)
app.include_router(patients.router)
app.include_router(caregivers.router)
