from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.infrastructure.database.connection import get_db
from app.domain.models.user import User
from app.domain.schemas.user_schema import UserCreate, UserResponse
from app.domain.schemas.user_patient_schema import UserWithPatientCreate, UserWithPatientResponse
from app.domain.models.caregiver import Caregiver
from app.domain.schemas.user_caregiver_schema import UserWithCaregiverCreate, UserWithCaregiverResponse
from app.domain.models.patient import Patient
from app.use_cases.auth.dependencies import exigir_admin
from typing import List

router = APIRouter(prefix="/usuarios", tags=["Usuários"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verifica email duplicado
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    hashed = pwd_context.hash(user.senha)
    db_user = User(**user.model_dump(exclude={"senha"}), senha=hashed)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=List[UserResponse])
def list_users(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return db.query(User).offset(skip).limit(limit).all()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, dados: UserCreate, db: Session = Depends(get_db), usuario = Depends(exigir_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    for campo, valor in dados.model_dump(exclude={"senha"}).items():
        setattr(user, campo, valor)

    if dados.senha:
        user.senha = pwd_context.hash(dados.senha)

    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), usuario = Depends(exigir_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    db.delete(user)
    db.commit()


# create user with patient profile
@router.post("/paciente", response_model=UserWithPatientResponse, status_code=201)
def criar_usuario_paciente(dados: UserWithPatientCreate, db: Session = Depends(get_db)):
    # Verifica duplicidade
    if db.query(User).filter(User.email == dados.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    # Cria o usuário
    usuario = User(
        nome=dados.nome,
        email=dados.email,
        senha=pwd_context.hash(dados.senha),
        tipo="PACIENTE",           # força o tipo
        telefone=dados.telefone,
        foto_url=dados.foto_url,
    )
    db.add(usuario)
    db.flush()  # ← gera o ID sem commitar ainda

    # Cria o perfil de paciente usando o ID gerado
    paciente = Patient(
        usuario_id=usuario.id,     # ← ID já disponível graças ao flush()
        data_nascimento=dados.data_nascimento,
        tipo_sanguineo=dados.tipo_sanguineo,
        telefone_emergencia=dados.telefone_emergencia,
        contato_emergencia=dados.contato_emergencia,
        observacoes=dados.observacoes,
        alergias=dados.alergias,
        condicoes_medicas=dados.condicoes_medicas,
    )
    db.add(paciente)

    # Commita tudo junto — se qualquer coisa falhar, nada é salvo
    db.commit()
    db.refresh(usuario)
    return usuario

@router.post("/cuidador", response_model=UserWithCaregiverResponse, status_code=201)
def criar_usuario_cuidador(dados: UserWithCaregiverCreate, db: Session = Depends(get_db)):
    # Verifica duplicidade
    if db.query(User).filter(User.email == dados.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    # Cria o usuário
    usuario = User(
        nome=dados.nome,
        email=dados.email,
        senha=pwd_context.hash(dados.senha),
        tipo="CUIDADOR",    # força o tipo        
        telefone=dados.telefone,
        foto_url=dados.foto_url,
    )
    db.add(usuario)
    db.flush()  # ← gera o ID sem commitar ainda  

    # Cria o perfil de paciente usando o ID gerado
    cuidador = Caregiver(
        usuario_id=usuario.id, # ← ID já disponível graças ao flush()   
        crm=dados.crm,
        especialidade=dados.especialidade
    )
    db.add(cuidador)

    # Commita tudo junto — se qualquer coisa falhar, nada é salvo
    db.commit()
    db.refresh(usuario)
    return usuario