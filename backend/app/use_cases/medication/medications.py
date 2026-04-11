from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.medication import Medication
from app.domain.schemas.medication_schema import MedicationCreate, MedicationUpdate, MedicationResponse
from typing import List

router = APIRouter(prefix="/medicamentos", tags=["Medicamentos"])

@router.post("/", response_model=MedicationResponse, status_code=status.HTTP_201_CREATED)
def create_medication(data: MedicationCreate, db: Session = Depends(get_db)):
    # Verifica código de barras duplicado se fornecido
    if data.codigo_barras:
        existing = db.query(Medication).filter(Medication.codigo_barras == data.codigo_barras).first()
        if existing:
            raise HTTPException(status_code=400, detail="Código de barras já existe")
    
    db_obj = Medication(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[MedicationResponse])
def list_medications(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Medication).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=MedicationResponse)
def get_medication(id: int, db: Session = Depends(get_db)):
    obj = db.query(Medication).filter(Medication.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    return obj

@router.put("/{id}", response_model=MedicationResponse)
def update_medication(id: int, data: MedicationUpdate, db: Session = Depends(get_db)):
    obj = db.query(Medication).filter(Medication.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)
    
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication(id: int, db: Session = Depends(get_db)):
    obj = db.query(Medication).filter(Medication.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Medicamento não encontrado")
    
    db.delete(obj)
    db.commit()
