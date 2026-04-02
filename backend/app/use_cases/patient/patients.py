from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.patient import Patient
from app.domain.models.user import User as Usuario
from app.domain.schemas.patient_schema import PatientCreate, PatientResponse, PatientUpdate
from app.use_cases.auth.dependencies import exigir_paciente, exigir_cuidador_ou_admin
from typing import List

router = APIRouter(prefix="/pacientes", tags=["Pacientes"])

@router.post("/", response_model=PatientResponse, status_code=201)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db), usuario: Usuario = Depends(exigir_cuidador_ou_admin)):
    db_patient = Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/", response_model=List[PatientResponse])
def list_patients(skip: int = 0, limit: int = 20, db: Session = Depends(get_db), usuario: Usuario = Depends(exigir_cuidador_ou_admin)):
    return db.query(Patient).offset(skip).limit(limit).all()

## rotas fixas devem vir antes das rotas com variaveis
# Paciente vê seu próprio perfil
@router.get("/me")
def meu_perfil(usuario: Usuario = Depends(exigir_paciente)):
    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "perfil": usuario.paciente,
    }

# Paciente atualiza suas próprias informações
@router.put("/me")
def atualizar_meu_perfil(
    dados: PatientUpdate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(exigir_paciente),
):
    paciente = usuario.paciente
    for campo, valor in dados.model_dump(exclude_none=True).items():
        setattr(paciente, campo, valor)
    db.commit()
    db.refresh(paciente)
    return paciente

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(exigir_cuidador_ou_admin)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: int, dados: PatientUpdate, db: Session = Depends(get_db), usuario: Usuario = Depends(exigir_cuidador_ou_admin)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    for campo, valor in dados.model_dump(exclude_none=True).items():
        setattr(patient, campo, valor)
    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: int, db: Session = Depends(get_db), usuario: Usuario = Depends(exigir_cuidador_ou_admin)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    db.delete(patient)
    db.commit()