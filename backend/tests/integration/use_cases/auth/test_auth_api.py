from app.domain.models.user import User
from app.use_cases.auth.service import hash_senha

def test_login_sucesso(client, db_session):
    usuario = User(nome="Teste", email="login@teste.com", senha=hash_senha("123"), tipo="PACIENTE", ativo=True)
    db_session.add(usuario)
    db_session.commit()
    response = client.post("/auth/login", json={"email": "login@teste.com", "senha": "123"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["tipo_usuario"] == "PACIENTE"

def test_login_senha_incorreta(client, db_session):
    usuario = User(nome="Teste", email="errado@teste.com", senha=hash_senha("123"), tipo="PACIENTE", ativo=True)
    db_session.add(usuario)
    db_session.commit()
    response = client.post("/auth/login", json={"email": "errado@teste.com", "senha": "senhaerrada"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciais inválidas"