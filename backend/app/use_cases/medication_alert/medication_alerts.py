from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.medication_alert import MedicationAlert
from app.domain.schemas.medication_alert_schema import MedicationAlertCreate, MedicationAlertUpdate, MedicationAlertResponse
from typing import List

router = APIRouter(prefix="/alertas-medicamento", tags=["Alertas-Medicamento"])

@router.post("/", response_model=MedicationAlertResponse, status_code=status.HTTP_201_CREATED)
def create_medication_alert(data: MedicationAlertCreate, db: Session = Depends(get_db)):
    db_obj = MedicationAlert(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[MedicationAlertResponse])
def list_medication_alerts(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(MedicationAlert).offset(skip).limit(limit).all()

@router.get("/paciente-medicamento/{pm_id}", response_model=List[MedicationAlertResponse])
def list_by_patient_medication(pm_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(MedicationAlert).filter(
        MedicationAlert.paciente_medicamento_id == pm_id
    ).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=MedicationAlertResponse)
def get_medication_alert(id: int, db: Session = Depends(get_db)):
    obj = db.query(MedicationAlert).filter(MedicationAlert.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    return obj

@router.put("/{id}", response_model=MedicationAlertResponse)
def update_medication_alert(id: int, data: MedicationAlertUpdate, db: Session = Depends(get_db)):
    obj = db.query(MedicationAlert).filter(MedicationAlert.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication_alert(id: int, db: Session = Depends(get_db)):
    obj = db.query(MedicationAlert).filter(MedicationAlert.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")

    # Hard delete
    db.delete(obj)
    db.commit()
