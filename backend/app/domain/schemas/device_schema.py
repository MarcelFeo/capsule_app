from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DeviceBase(BaseModel):
    usuario_id: int
    push_token: str
    plataforma: Optional[str] = None
    nome_dispositivo: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    push_token: Optional[str] = None
    plataforma: Optional[str] = None
    nome_dispositivo: Optional[str] = None
    ativo: Optional[bool] = None

class DeviceResponse(DeviceBase):
    id: int
    ativo: bool
    ultima_atividade: Optional[datetime] = None

    class Config:
        from_attributes = True
