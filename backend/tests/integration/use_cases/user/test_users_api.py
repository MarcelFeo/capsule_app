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