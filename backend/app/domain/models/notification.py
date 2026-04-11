from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.database.connection import Base

class Notification(Base):
    __tablename__ = "notificacoes"

    id                  = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id          = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo                = Column(String)  # LEMBRETE_DOSE | ALERTA_ESTOQUE | RELATORIO | SISTEMA
    prioridade          = Column(String, default='NORMAL')  # BAIXA | NORMAL | ALTA | URGENTE
    mensagem            = Column(Text, nullable=False)
    referencia_tipo     = Column(String)
    referencia_id       = Column(Integer)
    data_envio          = Column(DateTime, server_default=func.now())
    data_leitura        = Column(DateTime)
    lida                = Column(Boolean, default=False)

    # Relationships
    usuario = relationship("User", foreign_keys=[usuario_id])
