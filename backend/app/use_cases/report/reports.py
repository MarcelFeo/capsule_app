from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.report import Report
from app.domain.schemas.report_schema import ReportCreate, ReportUpdate, ReportResponse
from typing import List

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])

@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(data: ReportCreate, db: Session = Depends(get_db)):
    db_obj = Report(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[ReportResponse])
def list_reports(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Report).offset(skip).limit(limit).all()

@router.get("/paciente/{paciente_id}", response_model=List[ReportResponse])
def list_by_patient(paciente_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Report).filter(Report.paciente_id == paciente_id).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=ReportResponse)
def get_report(id: int, db: Session = Depends(get_db)):
    obj = db.query(Report).filter(Report.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return obj

@router.put("/{id}", response_model=ReportResponse)
def update_report(id: int, data: ReportUpdate, db: Session = Depends(get_db)):
    obj = db.query(Report).filter(Report.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(id: int, db: Session = Depends(get_db)):
    obj = db.query(Report).filter(Report.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")

    # Hard delete
    db.delete(obj)
    db.commit()
