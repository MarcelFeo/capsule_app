from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.connection import Base

class Report(Base):
    __tablename__ = "relatorios"

    id              = Column(Integer, primary_key=True, autoincrement=True)
    paciente_id     = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    gerado_por      = Column(Integer, ForeignKey("usuarios.id"))
    tipo            = Column(String)  # ADERENCIA | VITAIS | HISTORICO_COMPLETO
    periodo_inicio  = Column(Date)
    periodo_fim     = Column(Date)
    dados           = Column(JSON)
    data_geracao    = Column(DateTime, server_default=func.now())

    # Relationships
    paciente = relationship("Patient", foreign_keys=[paciente_id])
    gerado_por_rel = relationship("User", foreign_keys=[gerado_por])
