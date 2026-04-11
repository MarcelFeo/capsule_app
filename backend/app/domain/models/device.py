from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database.connection import Base

class Device(Base):
    __tablename__ = "dispositivos"

    id                  = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id          = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    push_token          = Column(String, nullable=False)
    plataforma          = Column(String)  # iOS | ANDROID | WEB
    nome_dispositivo    = Column(String)
    ativo               = Column(Boolean, default=True)
    ultima_atividade    = Column(DateTime)

    # Relationships
    usuario = relationship("User", foreign_keys=[usuario_id])
