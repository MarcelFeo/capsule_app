from sqlalchemy import Boolean, Column, Integer, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Patient(Base):
    __tablename__ = "pacientes"

    id                   = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id           = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)
    data_nascimento      = Column(Date)
    tipo_sanguineo       = Column(String)
    telefone_emergencia  = Column(String)
    contato_emergencia   = Column(String)
    observacoes          = Column(Text)
    alergias             = Column(Text)
    condicoes_medicas    = Column(Text)

    usuario = relationship("User", back_populates="paciente")
