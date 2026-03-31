from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class PatientBase(BaseModel):
    data_nascimento: Optional[date] = None
    tipo_sanguineo: Optional[str] = None
    telefone_emergencia: Optional[str] = None
    contato_emergencia: Optional[str] = None
    observacoes: Optional[str] = None
    alergias: Optional[str] = None
    condicoes_medicas: Optional[str] = None

class PatientCreate(PatientBase):
    usuario_id: int

class PatientResponse(PatientBase):
    id: int
    usuario_id: int

    class Config:
        from_attributes = True
