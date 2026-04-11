from pydantic import BaseModel
from typing import Optional

class MedicationBase(BaseModel):
    nome: str
    nome_generico: Optional[str] = None
    descricao: Optional[str] = None
    fabricante: Optional[str] = None
    dosagem_padrao: Optional[str] = None
    unidade: Optional[str] = None
    tipo: Optional[str] = None
    codigo_barras: Optional[str] = None
    necessita_receita: Optional[bool] = False
    contraindicacoes: Optional[str] = None
    efeitos_colaterais: Optional[str] = None

class MedicationCreate(MedicationBase):
    pass

class MedicationUpdate(BaseModel):
    nome: Optional[str] = None
    nome_generico: Optional[str] = None
    descricao: Optional[str] = None
    fabricante: Optional[str] = None
    dosagem_padrao: Optional[str] = None
    unidade: Optional[str] = None
    tipo: Optional[str] = None
    codigo_barras: Optional[str] = None
    necessita_receita: Optional[bool] = None
    contraindicacoes: Optional[str] = None
    efeitos_colaterais: Optional[str] = None

class MedicationResponse(MedicationBase):
    id: int

    class Config:
        from_attributes = True
