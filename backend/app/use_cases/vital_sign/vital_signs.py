from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.vital_sign import VitalSign
from app.domain.schemas.vital_sign_schema import VitalSignCreate, VitalSignUpdate, VitalSignResponse
from typing import List

router = APIRouter(prefix="/registros-vitais", tags=["Registros-Vitais"])

@router.post("/", response_model=VitalSignResponse, status_code=status.HTTP_201_CREATED)
def create_vital_sign(data: VitalSignCreate, db: Session = Depends(get_db)):
    db_obj = VitalSign(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[VitalSignResponse])
def list_vital_signs(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(VitalSign).offset(skip).limit(limit).all()

@router.get("/paciente/{paciente_id}", response_model=List[VitalSignResponse])
def list_by_patient(paciente_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(VitalSign).filter(VitalSign.paciente_id == paciente_id).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=VitalSignResponse)
def get_vital_sign(id: int, db: Session = Depends(get_db)):
    obj = db.query(VitalSign).filter(VitalSign.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro vital não encontrado")
    return obj

@router.put("/{id}", response_model=VitalSignResponse)
def update_vital_sign(id: int, data: VitalSignUpdate, db: Session = Depends(get_db)):
    obj = db.query(VitalSign).filter(VitalSign.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro vital não encontrado")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vital_sign(id: int, db: Session = Depends(get_db)):
    obj = db.query(VitalSign).filter(VitalSign.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Registro vital não encontrado")

    # Hard delete
    db.delete(obj)
    db.commit()
