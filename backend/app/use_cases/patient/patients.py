from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Paciente
from app.schemas.schemas import PacienteCreate, PacienteResponse
from typing import List

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

@router.post("/", response_model=PacienteResponse, status_code=201)
def create_patient(paciente: PacienteCreate, db: Session = Depends(get_db)):
    db_paciente = Paciente(**paciente.model_dump())
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

@router.get("/", response_model=List[PacienteResponse])
def list_patients(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Paciente).offset(skip).limit(limit).all()

@router.get("/{paciente_id}", response_model=PacienteResponse)
def get_patient(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return paciente

@router.put("/{paciente_id}", response_model=PacienteResponse)
def update_patient(paciente_id: int, dados: PacienteCreate, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    for campo, valor in dados.model_dump().items():
        setattr(paciente, campo, valor)
    db.commit()
    db.refresh(paciente)
    return paciente

@router.delete("/{paciente_id}", status_code=204)
def delete_patient(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    db.delete(paciente)
    db.commit()
