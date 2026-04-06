import os
import pytest
os.environ["POSTGRES_USER"] = "teste_seguro"
os.environ["POSTGRES_PASSWORD"] = "teste_seguro"
os.environ["POSTGRES_DB"] = "banco_de_teste"
os.environ["POSTGRES_HOST"] = "localhost"
os.environ["POSTGRES_PORT"] = "5432"
os.environ["SECRET_KEY"] = "chave-super-secreta-dos-testes-123"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "60"
os.environ["ENVIRONMENT"] = "testing"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.infrastructure.database.connection import Base, get_db


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
import pytest
from app.domain.models.user import User
from app.use_cases.auth.service import hash_senha, criar_token

@pytest.fixture
def token_admin(db_session):
    admin = User(
        nome="Admin Teste",
        email="admin@teste.com",
        senha=hash_senha("senha123"),
        tipo="ADMIN",
        ativo=True
    )
    db_session.add(admin)
    db_session.commit()
    
    token = criar_token({"sub": str(admin.id), "tipo": admin.tipo})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def token_paciente(db_session):
    paciente = User(
        nome="Paciente Teste",
        email="paciente@teste.com",
        senha=hash_senha("senha123"),
        tipo="PACIENTE",
        ativo=True
    )
    db_session.add(paciente)
    db_session.commit()
    
    token = criar_token({"sub": str(paciente.id), "tipo": paciente.tipo})
    return {"Authorization": f"Bearer {token}"}