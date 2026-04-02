from app.use_cases.auth.service import hash_senha, verificar_senha, criar_token, decodificar_token

def test_hash_e_verificacao_de_senha():
    senha = "poopymcdoodly"
    hash_gerado = hash_senha(senha)
    assert hash_gerado != senha
    assert verificar_senha(senha, hash_gerado) is True
    assert verificar_senha("senhaerrada", hash_gerado) is False

def test_criar_e_decodificar_token():
    dados = {"sub": "1", "tipo": "PACIENTE"}
    token = criar_token(dados)
    assert token is not None
    payload_decodificado = decodificar_token(token)
    assert payload_decodificado["sub"] == "1"
    assert payload_decodificado["tipo"] == "PACIENTE"
    assert "exp" in payload_decodificado