import pytest
from fastapi import status

def test_admin_consegue_listar_usuarios(client, token_admin):
    response = client.get("/usuarios/", headers=token_admin)
    assert response.status_code == status.HTTP_200_OK
    assert type(response.json()) == list

def test_paciente_nao_pode_listar_usuarios(client, token_paciente):
    response = client.get("/usuarios/", headers=token_paciente)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()["detail"] == "Acesso exclusivo para admins"

def test_criar_usuario_com_perfil_cuidador_sucesso(client):
    payload = {
        "nome": "Necoarcson da Silva",
        "email": "neco@hospital.com",
        "senha": "senhasegura",
        "telefone": "11977777777",
        "crm": "98765-MG",
        "especialidade": "neurologia"
    }

    response = client.post("/usuarios/cuidador", json=payload)
    
    assert response.status_code == status.HTTP_201_CREATED
    dados = response.json()

    assert dados["email"] == "neco@hospital.com"
    assert dados["tipo"] == "CUIDADOR"
    assert "cuidador" in dados
    assert dados["cuidador"]["crm"] == "98765-MG"
    assert dados["cuidador"]["especialidade"] == "neurologia"



def test_nao_deve_criar_cuidador_com_email_duplicado(client):
    payload = {
        "nome": "Lajeson Santos Jr",
        "email": "churrasco@hospital.com",
        "senha": "123",
        "crm": "11111-SP",
        "especialidade": "Clínico"
    }

    client.post("/usuarios/cuidador", json=payload)
    response_erro = client.post("/usuarios/cuidador", json=payload)
    assert response_erro.status_code == status.HTTP_400_BAD_REQUEST
    assert response_erro.json()["detail"] == "E-mail já cadastrado"