from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DoseRecordBase(BaseModel):
    paciente_medicamento_id: int
    status: str
    data_hora_prevista: datetime
    observacao: Optional[str] = None

class DoseRecordCreate(DoseRecordBase):
    horario_medicacao_id: Optional[int] = None
    registrado_por: Optional[int] = None
    metodo_confirmacao: Optional[str] = None

class DoseRecordUpdate(BaseModel):
    data_hora_confirmada: Optional[datetime] = None
    status: Optional[str] = None
    observacao: Optional[str] = None
    metodo_confirmacao: Optional[str] = None

class DoseRecordResponse(DoseRecordBase):
    id: int
    horario_medicacao_id: Optional[int] = None
    registrado_por: Optional[int] = None
    data_hora_confirmada: Optional[datetime] = None
    metodo_confirmacao: Optional[str] = None

    class Config:
        from_attributes = True
