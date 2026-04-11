from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.connection import Base

class PatientCaregiver(Base):
    __tablename__ = "paciente_cuidadores"
    __table_args__ = (
        UniqueConstraint('paciente_id', 'cuidador_id', name='uq_paciente_cuidador'),
    )

    id              = Column(Integer, primary_key=True, autoincrement=True)
    paciente_id     = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    cuidador_id     = Column(Integer, ForeignKey("cuidadores.id"), nullable=False)
    tipo            = Column(String, nullable=False)  # PRINCIPAL | AUXILIAR | FAMILIAR
    ativo           = Column(Boolean, default=True)
    data_inicio     = Column(DateTime, server_default=func.now())

    # Relationships
    paciente = relationship("Patient", foreign_keys=[paciente_id])
    cuidador = relationship("Caregiver", foreign_keys=[cuidador_id])
