from pydantic import BaseModel, EmailStr
from typing import Optional
from app.domain.schemas.caregiver_schema import CaregiverResponse

class UserWithCaregiverCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    telefone: Optional[str] = None
    foto_url: Optional[str] = None
    crm: Optional[str] = None
    especialidade: Optional[str] = None

class UserWithCaregiverResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    tipo: str
    ativo: bool
    cuidador: Optional[CaregiverResponse] = None
    class Config:
        from_attributes = True