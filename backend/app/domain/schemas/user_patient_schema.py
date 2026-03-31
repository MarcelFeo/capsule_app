from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from .patient_schema import PatientResponse
from .user_schema import UserResponse

class UserWithPatientCreate(BaseModel):
    # Dados do usuário
    nome: str
    email: EmailStr
    senha: str
    telefone: Optional[str] = None
    foto_url: Optional[str] = None

    # Dados do perfil do paciente (opcionais no momento do cadastro)
    data_nascimento: Optional[date] = None
    tipo_sanguineo: Optional[str] = None
    telefone_emergencia: Optional[str] = None
    contato_emergencia: Optional[str] = None
    observacoes: Optional[str] = None
    alergias: Optional[str] = None
    condicoes_medicas: Optional[str] = None


class UserWithPatientResponse(UserResponse):
    paciente: Optional[PatientResponse] = None

    class Config:
        from_attributes = True
