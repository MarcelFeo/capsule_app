from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.patient_caregiver import PatientCaregiver
from app.domain.schemas.patient_caregiver_schema import PatientCaregiverCreate, PatientCaregiverUpdate, PatientCaregiverResponse
from typing import List

router = APIRouter(prefix="/paciente-cuidadores", tags=["Paciente-Cuidadores"])

@router.post("/", response_model=PatientCaregiverResponse, status_code=status.HTTP_201_CREATED)
def create_patient_caregiver(data: PatientCaregiverCreate, db: Session = Depends(get_db)):
    # Verifica duplicado
    existing = db.query(PatientCaregiver).filter(
        PatientCaregiver.paciente_id == data.paciente_id,
        PatientCaregiver.cuidador_id == data.cuidador_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Associação já existe")

    db_obj = PatientCaregiver(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[PatientCaregiverResponse])
def list_patient_caregivers(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(PatientCaregiver).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=PatientCaregiverResponse)
def get_patient_caregiver(id: int, db: Session = Depends(get_db)):
    obj = db.query(PatientCaregiver).filter(PatientCaregiver.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Associação não encontrada")
    return obj

@router.put("/{id}", response_model=PatientCaregiverResponse)
def update_patient_caregiver(id: int, data: PatientCaregiverUpdate, db: Session = Depends(get_db)):
    obj = db.query(PatientCaregiver).filter(PatientCaregiver.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Associação não encontrada")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient_caregiver(id: int, db: Session = Depends(get_db)):
    obj = db.query(PatientCaregiver).filter(PatientCaregiver.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Associação não encontrada")

    db.delete(obj)
    db.commit()
