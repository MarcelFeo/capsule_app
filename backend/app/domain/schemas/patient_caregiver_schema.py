from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PatientCaregiverBase(BaseModel):
    paciente_id: int
    cuidador_id: int
    tipo: str

class PatientCaregiverCreate(PatientCaregiverBase):
    pass

class PatientCaregiverUpdate(BaseModel):
    tipo: Optional[str] = None
    ativo: Optional[bool] = None

class PatientCaregiverResponse(PatientCaregiverBase):
    id: int
    ativo: bool
    data_inicio: Optional[datetime]

    class Config:
        from_attributes = True
