from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.infrastructure.database.connection import get_db
from app.domain.models.user import User
from app.use_cases.auth.service import verificar_senha, criar_token

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginInput(BaseModel):
    email: str
    senha: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    tipo_usuario: str

@router.post("/login", response_model=TokenResponse)
def login(dados: LoginInput, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == dados.email).first()

    if not usuario or not verificar_senha(dados.senha, usuario.senha):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas",
        )

    if not usuario.ativo:
        raise HTTPException(status_code=403, detail="Conta desativada")

    token = criar_token({
        "sub": str(usuario.id),   # ID do usuário
        "tipo": usuario.tipo,     # PACIENTE | CUIDADOR | ADMIN
    })

    return {"access_token": token, "tipo_usuario": usuario.tipo}
