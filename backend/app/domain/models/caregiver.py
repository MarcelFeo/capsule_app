from sqlalchemy import Boolean, Column, Integer, String, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Caregiver(Base):
    __tablename__ = "cuidadores"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id   = Column(Integer, ForeignKey("usuarios.id"), unique=True, nullable=False)
    crm          = Column(String)
    especialidade = Column(String)

    usuario = relationship("User", back_populates="cuidador")
