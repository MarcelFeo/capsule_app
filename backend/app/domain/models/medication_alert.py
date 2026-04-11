from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.connection import Base

class MedicationAlert(Base):
    __tablename__ = "alertas_medicamento"

    id                      = Column(Integer, primary_key=True, autoincrement=True)
    paciente_medicamento_id = Column(Integer, ForeignKey("paciente_medicamentos.id"), nullable=False)
    tipo                    = Column(String, nullable=False)  # ESTOQUE_BAIXO | VENCIMENTO | DOSE_PULADA | INTERACAO
    status                  = Column(String, default='ABERTO')  # ABERTO | RESOLVIDO | IGNORADO
    mensagem                = Column(Text)
    data_criacao            = Column(DateTime, server_default=func.now())
    data_resolucao          = Column(DateTime)

    # Relationships
    paciente_medicamento = relationship("PatientMedication", foreign_keys=[paciente_medicamento_id])
