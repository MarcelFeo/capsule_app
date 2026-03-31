from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class CaregiverBase(BaseModel):
    crm: Optional[str] = None
    especialidade: Optional[str] = None

class CaregiverCreate(CaregiverBase):
    usuario_id: int

class CaregiverResponse(CaregiverBase):
    id: int
    usuario_id: int

    class Config:
        from_attributes = True
