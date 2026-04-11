from sqlalchemy import Boolean, Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database.connection import Base

class MedicationSchedule(Base):
    __tablename__ = "horarios_medicacao"

    id                      = Column(Integer, primary_key=True, autoincrement=True)
    paciente_medicamento_id = Column(Integer, ForeignKey("paciente_medicamentos.id"), nullable=False)
    horario                 = Column(Time, nullable=False)
    dias_semana             = Column(String)  # e.g. "SEG,QUA,SEX" or "*"
    tolerancia_minutos      = Column(Integer, default=30)
    ativo                   = Column(Boolean, default=True)

    # Relationships
    paciente_medicamento = relationship("PatientMedication", foreign_keys=[paciente_medicamento_id])
