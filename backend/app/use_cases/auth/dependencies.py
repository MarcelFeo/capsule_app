from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.infrastructure.database.connection import get_db
from app.domain.models.user import User
from app.use_cases.auth.service import decodificar_token

bearer_scheme = HTTPBearer()

def get_usuario_atual(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = decodificar_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    usuario = db.query(User).filter(User.id == payload.get("sub")).first()

    if not usuario or not usuario.ativo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado ou inativo",
        )

    return usuario


def exigir_paciente(usuario: User = Depends(get_usuario_atual)) -> User:
    if usuario.tipo != "PACIENTE":
        raise HTTPException(status_code=403, detail="Acesso exclusivo para pacientes")
    return usuario

def exigir_cuidador(usuario: User = Depends(get_usuario_atual)) -> User:
    if usuario.tipo != "CUIDADOR":
        raise HTTPException(status_code=403, detail="Acesso exclusivo para cuidadores")
    return usuario

def exigir_admin(usuario: User = Depends(get_usuario_atual)) -> User:
    if usuario.tipo != "ADMIN":
        raise HTTPException(status_code=403, detail="Acesso exclusivo para admins")
    return usuario

def exigir_cuidador_ou_admin(usuario: User = Depends(get_usuario_atual)) -> User:
    if usuario.tipo not in ("CUIDADOR", "ADMIN"):
        raise HTTPException(status_code=403, detail="Sem permissão para esta rota")
    return usuario
