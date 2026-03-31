from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.caregiver import Caregiver
from app.domain.schemas.caregiver_schema import CaregiverCreate, CaregiverResponse
from app.use_cases.auth.dependencies import exigir_admin
from typing import List

router = APIRouter(prefix="/cuidadores", tags=["Cuidadores"])
@router.post("/", response_model=CaregiverResponse, status_code=status.HTTP_201_CREATED)
def create_caregiver(caregiver: CaregiverCreate, db: Session = Depends(get_db), usuario = Depends(exigir_admin)):
    db_caregiver = Caregiver(**caregiver.model_dump())
    db.add(db_caregiver)
    db.commit()
    db.refresh(db_caregiver)
    return db_caregiver

@router.get("/", response_model=List[CaregiverResponse])
def list_caregivers(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), usuario = Depends(exigir_admin)):
    return db.query(Caregiver).offset(skip).limit(limit).all()

@router.get("/{caregiver_id}", response_model=CaregiverResponse)
def get_caregiver(caregiver_id: int, db: Session = Depends(get_db), usuario = Depends(exigir_admin)):
    caregiver = db.query(Caregiver).filter(Caregiver.id == caregiver_id).first()
    if not caregiver:
        raise HTTPException(status_code=404, detail="Cuidador não encontrado")
    return caregiver

@router.put("/{caregiver_id}", response_model=CaregiverResponse)
def update_caregiver(caregiver_id: int, dados: CaregiverCreate, db: Session = Depends(get_db), usuario = Depends(exigir_admin)):
    caregiver = db.query(Caregiver).filter(Caregiver.id == caregiver_id).first()
    if not caregiver:
        raise HTTPException(status_code=404, detail="Cuidador não encontrado")
    for campo, valor in dados.model_dump().items():
        setattr(caregiver, campo, valor)
    db.commit()
    db.refresh(caregiver)
    return caregiver

@router.delete("/{caregiver_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_caregiver(caregiver_id: int, db: Session = Depends(get_db), usuario = Depends(exigir_admin)):
    caregiver = db.query(Caregiver).filter(Caregiver.id == caregiver_id).first()
    if not caregiver:
        raise HTTPException(status_code=404, detail="Cuidador não encontrado")
    db.delete(caregiver)
    db.commit()


