from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VitalSignBase(BaseModel):
    paciente_id: int
    tipo: str
    valor: float
    unidade: Optional[str] = None

class VitalSignCreate(VitalSignBase):
    registrado_por: Optional[int] = None
    observacao: Optional[str] = None

class VitalSignUpdate(BaseModel):
    valor: Optional[float] = None
    unidade: Optional[str] = None
    observacao: Optional[str] = None

class VitalSignResponse(VitalSignBase):
    id: int
    registrado_por: Optional[int] = None
    data_hora: Optional[datetime]
    observacao: Optional[str] = None

    class Config:
        from_attributes = True
