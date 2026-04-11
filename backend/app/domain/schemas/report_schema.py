from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import date, datetime

class ReportBase(BaseModel):
    paciente_id: int
    tipo: str
    periodo_inicio: date
    periodo_fim: date

class ReportCreate(ReportBase):
    gerado_por: Optional[int] = None
    dados: Optional[Dict[str, Any]] = None

class ReportUpdate(BaseModel):
    tipo: Optional[str] = None
    periodo_inicio: Optional[date] = None
    periodo_fim: Optional[date] = None
    dados: Optional[Dict[str, Any]] = None

class ReportResponse(ReportBase):
    id: int
    gerado_por: Optional[int] = None
    dados: Optional[Dict[str, Any]] = None
    data_geracao: Optional[datetime]

    class Config:
        from_attributes = True
