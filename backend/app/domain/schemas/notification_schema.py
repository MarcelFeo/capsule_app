from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    usuario_id: int
    mensagem: str
    tipo: Optional[str] = None
    prioridade: Optional[str] = 'NORMAL'
    referencia_tipo: Optional[str] = None
    referencia_id: Optional[int] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    lida: Optional[bool] = None
    data_leitura: Optional[datetime] = None

class NotificationResponse(NotificationBase):
    id: int
    data_envio: Optional[datetime]
    data_leitura: Optional[datetime] = None
    lida: bool

    class Config:
        from_attributes = True
