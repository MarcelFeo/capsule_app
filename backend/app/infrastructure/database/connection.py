from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,           # conexões mantidas abertas no pool
    max_overflow=20,        # conexões extras em pico
    pool_pre_ping=True,     # verifica conexão antes de usar (evita conexões mortas)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()