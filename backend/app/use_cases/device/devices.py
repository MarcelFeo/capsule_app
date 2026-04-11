from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.device import Device
from app.domain.schemas.device_schema import DeviceCreate, DeviceUpdate, DeviceResponse
from typing import List

router = APIRouter(prefix="/dispositivos", tags=["Dispositivos"])

@router.post("/", response_model=DeviceResponse, status_code=status.HTTP_201_CREATED)
def create_device(data: DeviceCreate, db: Session = Depends(get_db)):
    db_obj = Device(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[DeviceResponse])
def list_devices(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Device).offset(skip).limit(limit).all()

@router.get("/usuario/{usuario_id}", response_model=List[DeviceResponse])
def list_by_user(usuario_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Device).filter(Device.usuario_id == usuario_id).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=DeviceResponse)
def get_device(id: int, db: Session = Depends(get_db)):
    obj = db.query(Device).filter(Device.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Dispositivo não encontrado")
    return obj

@router.put("/{id}", response_model=DeviceResponse)
def update_device(id: int, data: DeviceUpdate, db: Session = Depends(get_db)):
    obj = db.query(Device).filter(Device.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Dispositivo não encontrado")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_device(id: int, db: Session = Depends(get_db)):
    obj = db.query(Device).filter(Device.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Dispositivo não encontrado")

    # Soft delete
    obj.ativo = False
    db.commit()
