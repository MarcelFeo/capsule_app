from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.dose_record import DoseRecord
from app.domain.schemas.dose_record_schema import DoseRecordCreate, DoseRecordUpdate, DoseRecordResponse
from typing import List

router = APIRouter(prefix="/registros-dose", tags=["Registros-Dose"])

@router.post("/", response_model=DoseRecordResponse, status_code=status.HTTP_201_CREATED)
def create_dose_record(data: DoseRecordCreate, db: Session = Depends(get_db)):
    db_obj = DoseRecord(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[DoseRecordResponse])
def list_dose_records(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(DoseRecord).offset(skip).limit(limit).all()

@router.get("/paciente-medicamento/{pm_id}", response_model=List[DoseRecordResponse])
def list_by_patient_medication(pm_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(DoseRecord).filter(
        DoseRecord.paciente_medicamento_id == pm_id
    ).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=DoseRecordResponse)
def get_dose_record(id: int, db: Session = Depends(get_db)):
    obj = db.query(DoseRecord).filter(DoseRecord.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro de dose não encontrado")
    return obj

@router.put("/{id}", response_model=DoseRecordResponse)
def update_dose_record(id: int, data: DoseRecordUpdate, db: Session = Depends(get_db)):
    obj = db.query(DoseRecord).filter(DoseRecord.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro de dose não encontrado")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dose_record(id: int, db: Session = Depends(get_db)):
    obj = db.query(DoseRecord).filter(DoseRecord.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro de dose não encontrado")

    # Hard delete
    db.delete(obj)
    db.commit()
