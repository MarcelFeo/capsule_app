from sqlalchemy import Boolean, Column, Integer, String, Text
from app.infrastructure.database.connection import Base

class Medication(Base):
    __tablename__ = "medicamentos"

    id                  = Column(Integer, primary_key=True, autoincrement=True)
    nome                = Column(String, nullable=False)
    nome_generico       = Column(String)
    descricao           = Column(Text)
    fabricante          = Column(String)
    dosagem_padrao      = Column(String)
    unidade             = Column(String)
    tipo                = Column(String)  # COMPRIMIDO | LÍQUIDO | INJEÇÃO | CÁPSULA | PATCH
    codigo_barras       = Column(String, unique=True)
    necessita_receita   = Column(Boolean, default=False)
    contraindicacoes    = Column(Text)
    efeitos_colaterais  = Column(Text)
