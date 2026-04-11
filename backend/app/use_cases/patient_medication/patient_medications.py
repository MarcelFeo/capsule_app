from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.patient_medication import PatientMedication
from app.domain.schemas.patient_medication_schema import PatientMedicationCreate, PatientMedicationUpdate, PatientMedicationResponse
from typing import List

router = APIRouter(prefix="/paciente-medicamentos", tags=["Paciente-Medicamentos"])

@router.post("/", response_model=PatientMedicationResponse, status_code=status.HTTP_201_CREATED)
def create_patient_medication(data: PatientMedicationCreate, db: Session = Depends(get_db)):
    db_obj = PatientMedication(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[PatientMedicationResponse])
def list_patient_medications(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(PatientMedication).offset(skip).limit(limit).all()

@router.get("/paciente/{paciente_id}", response_model=List[PatientMedicationResponse])
def list_by_patient(paciente_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(PatientMedication).filter(PatientMedication.paciente_id == paciente_id).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=PatientMedicationResponse)
def get_patient_medication(id: int, db: Session = Depends(get_db)):
    obj = db.query(PatientMedication).filter(PatientMedication.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Prescrição não encontrada")
    return obj

@router.put("/{id}", response_model=PatientMedicationResponse)
def update_patient_medication(id: int, data: PatientMedicationUpdate, db: Session = Depends(get_db)):
    obj = db.query(PatientMedication).filter(PatientMedication.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Prescrição não encontrada")
    
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)
    
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient_medication(id: int, db: Session = Depends(get_db)):
    obj = db.query(PatientMedication).filter(PatientMedication.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Prescrição não encontrada")
    
    # Soft delete
    obj.ativo = False
    db.commit()
