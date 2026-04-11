from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.notification import Notification
from app.domain.schemas.notification_schema import NotificationCreate, NotificationUpdate, NotificationResponse
from typing import List

router = APIRouter(prefix="/notificacoes", tags=["Notificações"])

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
def create_notification(data: NotificationCreate, db: Session = Depends(get_db)):
    db_obj = Notification(**data.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[NotificationResponse])
def list_notifications(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Notification).offset(skip).limit(limit).all()

@router.get("/usuario/{usuario_id}", response_model=List[NotificationResponse])
def list_by_user(usuario_id: int, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.usuario_id == usuario_id).offset(skip).limit(limit).all()

@router.get("/{id}", response_model=NotificationResponse)
def get_notification(id: int, db: Session = Depends(get_db)):
    obj = db.query(Notification).filter(Notification.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    return obj

@router.put("/{id}", response_model=NotificationResponse)
def update_notification(id: int, data: NotificationUpdate, db: Session = Depends(get_db)):
    obj = db.query(Notification).filter(Notification.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(obj, field, value)
    
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(id: int, db: Session = Depends(get_db)):
    obj = db.query(Notification).filter(Notification.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")
    
    # Hard delete
    db.delete(obj)
    db.commit()
