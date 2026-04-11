from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database.connection import Base

class DoseRecord(Base):
    __tablename__ = "registros_dose"

    id                      = Column(Integer, primary_key=True, autoincrement=True)
    paciente_medicamento_id = Column(Integer, ForeignKey("paciente_medicamentos.id"), nullable=False)
    horario_medicacao_id    = Column(Integer, ForeignKey("horarios_medicacao.id"))
    registrado_por          = Column(Integer, ForeignKey("usuarios.id"))
    data_hora_prevista      = Column(DateTime, nullable=False)
    data_hora_confirmada    = Column(DateTime)
    status                  = Column(String, nullable=False)  # TOMADO | PENDENTE | PULADO | ATRASADO
    observacao              = Column(Text)
    metodo_confirmacao      = Column(String)  # MANUAL | QR_CODE | NFC

    # Relationships
    paciente_medicamento = relationship("PatientMedication", foreign_keys=[paciente_medicamento_id])
    horario_medicacao = relationship("MedicationSchedule", foreign_keys=[horario_medicacao_id])
    registrado_por_rel = relationship("User", foreign_keys=[registrado_por])
