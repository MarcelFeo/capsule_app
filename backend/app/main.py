from fastapi import FastAPI
from app.database import Base, engine
from app.routers import usuarios, pacientes, cuidadores

# Cria as tabelas automaticamente (em produção use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Capsule API", version="1.0.0")

app.include_router(usuarios.router)
app.include_router(pacientes.router)
app.include_router(cuidadores.router)
