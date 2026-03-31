from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import get_db
from app.models.models import Usuario
from app.schemas.schemas import UsuarioCreate, UsuarioResponse
from typing import List

router = APIRouter(prefix="/usuarios", tags=["Usuários"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def create_user(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    # Verifica email duplicado
    if db.query(Usuario).filter(Usuario.email == usuario.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    hashed = pwd_context.hash(usuario.senha)
    db_usuario = Usuario(**usuario.model_dump(exclude={"senha"}), senha=hashed)

    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

@router.get("/", response_model=List[UsuarioResponse])
def list_users(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Usuario).offset(skip).limit(limit).all()

@router.get("/{usuario_id}", response_model=UsuarioResponse)
def get_user(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario

@router.put("/{usuario_id}", response_model=UsuarioResponse)
def update_user(usuario_id: int, dados: UsuarioCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    for campo, valor in dados.model_dump(exclude={"senha"}).items():
        setattr(usuario, campo, valor)

    if dados.senha:
        usuario.senha = pwd_context.hash(dados.senha)

    db.commit()
    db.refresh(usuario)
    return usuario

@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(usuario)
    db.commit()
