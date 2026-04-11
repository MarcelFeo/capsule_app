from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.connection import Base

class VitalSign(Base):
    __tablename__ = "registros_vitais"

    id              = Column(Integer, primary_key=True, autoincrement=True)
    paciente_id     = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    registrado_por  = Column(Integer, ForeignKey("usuarios.id"))
    tipo            = Column(String, nullable=False)  # PRESSAO_SISTOLICA | PRESSAO_DIASTOLICA | GLICOSE | PESO | TEMPERATURA | SATURACAO
    valor           = Column(Float, nullable=False)
    unidade         = Column(String)
    data_hora       = Column(DateTime, server_default=func.now())
    observacao      = Column(Text)

    # Relationships
    paciente = relationship("Patient", foreign_keys=[paciente_id])
    registrado_por_rel = relationship("User", foreign_keys=[registrado_por])
