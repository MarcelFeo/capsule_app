from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class UserBase(BaseModel):
    nome: str
    email: EmailStr
    tipo: str                   # PACIENTE | CUIDADOR | ADMIN
    telefone: Optional[str] = None
    foto_url: Optional[str] = None

class UserCreate(UserBase):
    senha: str                  # senha em texto puro — será hasheada no service

class UserResponse(UserBase):
    id: int
    ativo: bool
    data_criacao: Optional[datetime]

    class Config:
        from_attributes = True  # habilita leitura de ORM objects
