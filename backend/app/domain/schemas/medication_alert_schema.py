from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MedicationAlertBase(BaseModel):
    paciente_medicamento_id: int
    tipo: str
    mensagem: Optional[str] = None

class MedicationAlertCreate(MedicationAlertBase):
    pass

class MedicationAlertUpdate(BaseModel):
    status: Optional[str] = None
    mensagem: Optional[str] = None

class MedicationAlertResponse(MedicationAlertBase):
    id: int
    status: str
    data_criacao: Optional[datetime]
    data_resolucao: Optional[datetime] = None

    class Config:
        from_attributes = True
