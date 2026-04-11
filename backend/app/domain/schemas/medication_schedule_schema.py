from pydantic import BaseModel
from typing import Optional
from datetime import time

class MedicationScheduleBase(BaseModel):
    paciente_medicamento_id: int
    horario: time
    dias_semana: Optional[str] = None
    tolerancia_minutos: Optional[int] = 30

class MedicationScheduleCreate(MedicationScheduleBase):
    pass

class MedicationScheduleUpdate(BaseModel):
    horario: Optional[time] = None
    dias_semana: Optional[str] = None
    tolerancia_minutos: Optional[int] = None
    ativo: Optional[bool] = None

class MedicationScheduleResponse(MedicationScheduleBase):
    id: int
    ativo: bool

    class Config:
        from_attributes = True
