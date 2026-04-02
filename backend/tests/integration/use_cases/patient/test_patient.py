import pytest
from fastapi import status

def test_paciente_nao_autenticado_nao_acessa_perfil(client):
    response = client.get("/pacientes/me")  
    assert response.status_code == status.HTTP_403_FORBIDDEN

def test_paciente_acessa_proprio_perfil(client, token_paciente):
    response = client.get("/pacientes/me", headers=token_paciente)    
    assert response.status_code == status.HTTP_200_OK
    dados = response.json()
    assert dados["nome"] == "Paciente Teste"