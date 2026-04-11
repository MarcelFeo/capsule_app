from sqlalchemy import Boolean, Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.connection import Base

class PatientMedication(Base):
    __tablename__ = "paciente_medicamentos"

    id                  = Column(Integer, primary_key=True, autoincrement=True)
    paciente_id         = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    medicamento_id      = Column(Integer, ForeignKey("medicamentos.id"), nullable=False)
    prescrito_por       = Column(Integer, ForeignKey("cuidadores.id"))
    dosagem             = Column(String)
    data_inicio         = Column(Date, nullable=False)
    data_fim            = Column(Date)
    instrucoes          = Column(Text)
    estoque_atual       = Column(Integer, default=0)
    estoque_minimo      = Column(Integer, default=5)
    data_vencimento     = Column(Date)
    ativo               = Column(Boolean, default=True)
    frequencia          = Column(String)  # DIÁRIO | SEMANAL | SOB_DEMANDA

    # Relationships
    paciente = relationship("Patient", foreign_keys=[paciente_id])
    medicamento = relationship("Medication", foreign_keys=[medicamento_id])
    prescrito_por_rel = relationship("Caregiver", foreign_keys=[prescrito_por])
