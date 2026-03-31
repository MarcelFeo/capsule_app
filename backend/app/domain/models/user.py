from sqlalchemy import Boolean, Column, Integer, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "usuarios"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    nome          = Column(String, nullable=False)
    email         = Column(String, unique=True, nullable=False)
    senha         = Column(String, nullable=False)          # bcrypt hash
    tipo          = Column(String, nullable=False)          # PACIENTE | CUIDADOR | ADMIN
    telefone      = Column(String)
    foto_url      = Column(String)
    ativo         = Column(Boolean, default=True)
    ultimo_login  = Column(DateTime)
    data_criacao  = Column(DateTime, server_default=func.now())

    # Relationships
    paciente  = relationship("Patient",  back_populates="usuario", uselist=False)
    cuidador  = relationship("Caregiver",  back_populates="usuario", uselist=False)
