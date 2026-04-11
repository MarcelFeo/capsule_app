from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.medication_schedule import MedicationSchedule
from app.domain.schemas.medication_schedule_schema import MedicationScheduleCreate, MedicationScheduleUpdate, MedicationScheduleResponse
from typing import List

router = APIRouter(prefix="/horarios-medicacao", tags=["Horários-Medicação"])

@router.post("/", response_model=MedicationScheduleResponse, status_code=status.HTTP_201_CREATED)
def create_medication_schedule(data: MedicationScheduleCreate, db: Session = Depends(get_db)):
    db_obj = MedicationSchedule(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[MedicationScheduleResponse])
def list_medication_schedules(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(MedicationSchedule).offset(skip).limit(limit).all()

@router.get("/paciente-medicamento/{pm_id}", response_model=List[MedicationScheduleResponse])
def list_by_patient_medication(pm_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(MedicationSchedule).filter(
        MedicationSchedule.paciente_medicamento_id == pm_id
    ).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=MedicationScheduleResponse)
def get_medication_schedule(id: int, db: Session = Depends(get_db)):
    obj = db.query(MedicationSchedule).filter(MedicationSchedule.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Horário não encontrado")
    return obj

@router.put("/{id}", response_model=MedicationScheduleResponse)
def update_medication_schedule(id: int, data: MedicationScheduleUpdate, db: Session = Depends(get_db)):
    obj = db.query(MedicationSchedule).filter(MedicationSchedule.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Horário não encontrado")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_medication_schedule(id: int, db: Session = Depends(get_db)):
    obj = db.query(MedicationSchedule).filter(MedicationSchedule.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Horário não encontrado")

    # Soft delete
    obj.ativo = False
    db.commit()
