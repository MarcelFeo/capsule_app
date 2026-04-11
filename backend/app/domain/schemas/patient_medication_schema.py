from pydantic import BaseModel
from typing import Optional
from datetime import date

class PatientMedicationBase(BaseModel):
    paciente_id: int
    medicamento_id: int
    dosagem: Optional[str] = None
    data_inicio: date
    data_fim: Optional[date] = None
    instrucoes: Optional[str] = None
    estoque_atual: Optional[int] = 0
    estoque_minimo: Optional[int] = 5
    data_vencimento: Optional[date] = None
    frequencia: Optional[str] = None

class PatientMedicationCreate(PatientMedicationBase):
    prescrito_por: Optional[int] = None

class PatientMedicationUpdate(BaseModel):
    prescrito_por: Optional[int] = None
    dosagem: Optional[str] = None
    data_fim: Optional[date] = None
    instrucoes: Optional[str] = None
    estoque_atual: Optional[int] = None
    estoque_minimo: Optional[int] = None
    data_vencimento: Optional[date] = None
    ativo: Optional[bool] = None
    frequencia: Optional[str] = None

class PatientMedicationResponse(PatientMedicationBase):
    id: int
    prescrito_por: Optional[int] = None
    ativo: bool

    class Config:
        from_attributes = True
