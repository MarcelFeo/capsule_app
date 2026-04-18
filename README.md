# Capsule App - Gerenciamento de Saúde

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Setup Rápido](#setup-rápido)
4. [Endpoints Principais](#endpoints-principais)
5. [Autenticação](#autenticação)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## 🎯 Visão Geral

**Capsule App** é uma API REST para gerenciamento de saúde de pacientes com:
- ✅ Autenticação JWT com controle de roles
- ✅ Gerenciamento de usuários, pacientes e cuidadores
- ✅ Sistema completo de medicamentos e prescrições
- ✅ Registros de vitais e histórico de doses
- ✅ Notificações e alertas automáticos
- ✅ Documentação automática (Swagger/ReDoc)

---

## ⚙️ Stack Tecnológico

| Componente | Tecnologia |
|-----------|-----------|
| **Backend** | Python 3.13 + FastAPI 0.115.6 |
| **ORM** | SQLAlchemy 2.0.36 |
| **Validação** | Pydantic 2.10.3 |
| **Auth** | JWT (python-jose) + bcrypt |
| **Banco de Dados** | PostgreSQL 16 |
| **Containerização** | Docker & Docker Compose |

---

## 🚀 Setup Rápido

### Pré-requisitos
- Docker & Docker Compose
- Python 3.13+ (para desenvolvimento local)

### 1. Iniciar Banco de Dados

```bash
cd backend
docker-compose up -d
```

Verificar: `docker ps | findstr capsule_db`

### 2. Instalar Dependências

```bash
pip install -r requirements.txt
```

### 3. Iniciar API

```bash
# IMPORTANTE: Execute na pasta backend, não dentro de app/
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> **Nota**: Se receber erro `ModuleNotFoundError: No module named 'app'`, certifique-se que você está na pasta `backend`, não em `backend/app`.

### 4. Acessar

- 🔗 **Swagger UI**: http://127.0.0.1:8000/docs
- 📚 **ReDoc**: http://127.0.0.1:8000/redoc

---

## 🔌 Endpoints Principais

### Autenticação & Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Fazer login (retorna JWT) |
| POST | `/usuarios/paciente` | Criar usuário Paciente |
| POST | `/usuarios/cuidador` | Criar usuário Cuidador |
| GET | `/usuarios/` | Listar usuários (requer ADMIN) |
| GET | `/usuarios/{id}` | Obter usuário (requer ADMIN) |
| POST | `/pacientes/` | Criar paciente |
| GET | `/pacientes/me` | Obter perfil próprio |
| GET | `/pacientes/` | Listar pacientes |

### Medicamentos & Prescrições
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/medicamentos/` | Criar medicamento |
| GET | `/medicamentos/` | Listar medicamentos |
| POST | `/paciente-medicamentos/` | Criar prescrição |
| GET | `/paciente-medicamentos/paciente/{paciente_id}` | Medicamentos do paciente |

### Horários, Doses & Vitais
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/horarios-medicacao/` | Criar horário |
| POST | `/registros-dose/` | Registrar dose |
| GET | `/registros-dose/paciente-medicamento/{pm_id}` | Histórico de doses |
| POST | `/registros-vitais/` | Adicionar vital |
| GET | `/registros-vitais/paciente/{paciente_id}` | Vitais do paciente |

### Alertas & Notificações
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/alertas-medicamento/paciente-medicamento/{pm_id}` | Alertas da prescrição |
| POST | `/notificacoes/` | Criar notificação |
| GET | `/notificacoes/usuario/{usuario_id}` | Notificações do usuário |

> **Nota**: Consulte `/docs` para documentação completa de todos os endpoints.

---

## 🔐 Autenticação

### Fazer Login

```bash
curl -X POST "http://127.0.0.1:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "senha": "senha123"
  }'

# Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Usar Token em endpoints protegidos

```bash
curl -X POST "http://127.0.0.1:8000/pacientes/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {access_token}" \
  -d '{}'
```

### Tipos de Usuário

| Tipo | Permissões |
|------|-----------|
| **PACIENTE** | Acesso ao próprio perfil e medicamentos |
| **CUIDADOR** | Acesso a pacientes sob seus cuidados |
| **ADMIN** | Acesso completo a todos os recursos |

---

## � Exemplos Práticos

### 1. Criar Usuário Paciente (POST)

```bash
curl -X POST "http://127.0.0.1:8000/usuarios/paciente" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "senha": "senha@123",
    "telefone": "11999999999",
    "data_nascimento": "1990-05-15",
    "tipo_sanguineo": "O+",
    "telefone_emergencia": "11988888888",
    "contato_emergencia": "Maria Silva",
    "alergias": "Penicilina",
    "condicoes_medicas": "Hipertensão"
  }'
```

**Response 201:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "tipo": "PACIENTE",
  "telefone": "11999999999",
  "foto_url": null,
  "ativo": true,
  "data_criacao": "2026-04-10T10:30:00"
}
```

---

### 1b. Criar Usuário Cuidador (POST)

```bash
curl -X POST "http://127.0.0.1:8000/usuarios/cuidador" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dr. Carlos Santos",
    "email": "carlos@exemplo.com",
    "senha": "senha@123",
    "telefone": "11999999999",
    "crm": "123456/SP",
    "especialidade": "Cardiologia"
  }'
```

**Response 201:**
```json
{
  "id": 2,
  "nome": "Dr. Carlos Santos",
  "email": "carlos@exemplo.com",
  "tipo": "CUIDADOR",
  "telefone": "11999999999",
  "foto_url": null,
  "ativo": true,
  "data_criacao": "2026-04-10T10:35:00"
}
```

---

### 2. Criar Paciente (POST)

```bash
curl -X POST "http://127.0.0.1:8000/pacientes/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "usuario_id": 1,
    "data_nascimento": "1990-05-15",
    "tipo_sanguineo": "O+",
    "telefone_emergencia": "11988888888",
    "contato_emergencia": "Maria Silva",
    "alergias": "Penicilina",
    "condicoes_medicas": "Hipertensão"
  }'
```

**Response 201:**
```json
{
  "id": 1,
  "usuario_id": 1,
  "data_nascimento": "1990-05-15",
  "tipo_sanguineo": "O+",
  "telefone_emergencia": "11988888888",
  "contato_emergencia": "Maria Silva",
  "alergias": "Penicilina",
  "condicoes_medicas": "Hipertensão",
  "observacoes": null
}
```

---

### 3. Criar Medicamento (POST)

```bash
curl -X POST "http://127.0.0.1:8000/medicamentos/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "nome": "Dipirona",
    "nome_generico": "Metamizol",
    "descricao": "Analgésico e antitérmico",
    "fabricante": "Medley",
    "dosagem_padrao": "500mg",
    "unidade": "comprimido",
    "tipo": "COMPRIMIDO",
    "necessita_receita": false,
    "efeitos_colaterais": "Tontura, náusea"
  }'
```

**Response 201:**
```json
{
  "id": 1,
  "nome": "Dipirona",
  "nome_generico": "Metamizol",
  "descricao": "Analgésico e antitérmico",
  "fabricante": "Medley",
  "dosagem_padrao": "500mg",
  "unidade": "comprimido",
  "tipo": "COMPRIMIDO",
  "codigo_barras": null,
  "necessita_receita": false,
  "contraindicacoes": null,
  "efeitos_colaterais": "Tontura, náusea"
}
```

---

### 4. Criar Prescrição (POST)

```bash
curl -X POST "http://127.0.0.1:8000/paciente-medicamentos/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "paciente_id": 1,
    "medicamento_id": 1,
    "prescrito_por": 2,
    "dosagem": "1 comprimido",
    "data_inicio": "2026-04-10",
    "data_fim": "2026-05-10",
    "instrucoes": "Tomar de 8 em 8 horas",
    "estoque_atual": 30,
    "estoque_minimo": 5,
    "frequencia": "DIÁRIO"
  }'
```

**Response 201:**
```json
{
  "id": 1,
  "paciente_id": 1,
  "medicamento_id": 1,
  "prescrito_por": 2,
  "dosagem": "1 comprimido",
  "data_inicio": "2026-04-10",
  "data_fim": "2026-05-10",
  "instrucoes": "Tomar de 8 em 8 horas",
  "estoque_atual": 30,
  "estoque_minimo": 5,
  "data_vencimento": null,
  "ativo": true,
  "frequencia": "DIÁRIO"
}
```

---

### 5. Criar Horário de Medicação (POST)

```bash
curl -X POST "http://127.0.0.1:8000/horarios-medicacao/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "paciente_medicamento_id": 1,
    "horario": "08:00:00",
    "dias_semana": "*",
    "tolerancia_minutos": 30
  }'
```

**Response 201:**
```json
{
  "id": 1,
  "paciente_medicamento_id": 1,
  "horario": "08:00:00",
  "dias_semana": "*",
  "tolerancia_minutos": 30,
  "ativo": true
}
```

---

### 6. Registrar Dose Tomada (POST)

```bash
curl -X POST "http://127.0.0.1:8000/registros-dose/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "paciente_medicamento_id": 1,
    "horario_medicacao_id": 1,
    "registrado_por": 1,
    "data_hora_prevista": "2026-04-10T08:00:00",
    "data_hora_confirmada": "2026-04-10T08:05:00",
    "status": "TOMADO",
    "metodo_confirmacao": "MANUAL"
  }'
```

**Response 201:**
```json
{
  "id": 1,
  "paciente_medicamento_id": 1,
  "horario_medicacao_id": 1,
  "registrado_por": 1,
  "data_hora_prevista": "2026-04-10T08:00:00",
  "data_hora_confirmada": "2026-04-10T08:05:00",
  "status": "TOMADO",
  "observacao": null,
  "metodo_confirmacao": "MANUAL"
}
```

---

### 7. Registrar Vital Sign (POST)

```bash
curl -X POST "http://127.0.0.1:8000/registros-vitais/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "paciente_id": 1,
    "registrado_por": 2,
    "tipo": "PRESSAO_SISTOLICA",
    "valor": 140.0,
    "unidade": "mmHg",
    "observacao": "Paciente ansioso"
  }'
```

**Response 201:**
```json
{
  "id": 1,
  "paciente_id": 1,
  "registrado_por": 2,
  "tipo": "PRESSAO_SISTOLICA",
  "valor": 140.0,
  "unidade": "mmHg",
  "data_hora": "2026-04-10T14:30:00",
  "observacao": "Paciente ansioso"
}
```

---

### 8. Criar Notificação (POST)

```bash
curl -X POST "http://127.0.0.1:8000/notificacoes/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "usuario_id": 1,
    "tipo": "LEMBRETE_DOSE",
    "prioridade": "NORMAL",
    "mensagem": "Hora de tomar o medicamento Dipirona",
    "referencia_tipo": "paciente_medicamento",
    "referencia_id": 1
  }'
```

**Response 201:**
```json
{
  "id": 1,
  "usuario_id": 1,
  "tipo": "LEMBRETE_DOSE",
  "prioridade": "NORMAL",
  "mensagem": "Hora de tomar o medicamento Dipirona",
  "referencia_tipo": "paciente_medicamento",
  "referencia_id": 1,
  "data_envio": "2026-04-10T14:35:00",
  "data_leitura": null,
  "lida": false
}
```

---

### 9. Listar Usuários (GET)

```bash
curl -X GET "http://127.0.0.1:8000/usuarios/?skip=0&limit=20"
```

**Response 200:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "tipo": "PACIENTE",
    "telefone": "11999999999",
    "foto_url": null,
    "ativo": true,
    "data_criacao": "2026-04-10T10:30:00"
  },
  {
    "id": 2,
    "nome": "Dra. Maria",
    "email": "maria@exemplo.com",
    "tipo": "CUIDADOR",
    "telefone": "11987654321",
    "foto_url": null,
    "ativo": true,
    "data_criacao": "2026-04-10T10:35:00"
  }
]
```

---

### 10. Obter Usuário por ID (GET)

```bash
curl -X GET "http://127.0.0.1:8000/usuarios/1"
```

**Response 200:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "tipo": "PACIENTE",
  "telefone": "11999999999",
  "foto_url": null,
  "ativo": true,
  "data_criacao": "2026-04-10T10:30:00"
}
```

---

### 11. Obter Medicamentos do Paciente (GET)

```bash
curl -X GET "http://127.0.0.1:8000/paciente-medicamentos/paciente/1"
```

**Response 200:**
```json
[
  {
    "id": 1,
    "paciente_id": 1,
    "medicamento_id": 1,
    "prescrito_por": 2,
    "dosagem": "1 comprimido",
    "data_inicio": "2026-04-10",
    "data_fim": "2026-05-10",
    "instrucoes": "Tomar de 8 em 8 horas",
    "estoque_atual": 30,
    "estoque_minimo": 5,
    "data_vencimento": null,
    "ativo": true,
    "frequencia": "DIÁRIO"
  }
]
```

---

### 12. Obter Vitais do Paciente (GET)

```bash
curl -X GET "http://127.0.0.1:8000/registros-vitais/paciente/1"
```

**Response 200:**
```json
[
  {
    "id": 1,
    "paciente_id": 1,
    "registrado_por": 2,
    "tipo": "PRESSAO_SISTOLICA",
    "valor": 140.0,
    "unidade": "mmHg",
    "data_hora": "2026-04-10T14:30:00",
    "observacao": "Paciente ansioso"
  },
  {
    "id": 2,
    "paciente_id": 1,
    "registrado_por": 2,
    "tipo": "GLICOSE",
    "valor": 105.0,
    "unidade": "mg/dL",
    "data_hora": "2026-04-10T14:35:00",
    "observacao": null
  }
]
```

---

### 13. Atualizar Prescrição (PUT)

```bash
curl -X PUT "http://127.0.0.1:8000/paciente-medicamentos/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "dosagem": "2 comprimidos",
    "estoque_atual": 25,
    "instrucoes": "Tomar de 6 em 6 horas"
  }'
```

**Response 200:**
```json
{
  "id": 1,
  "paciente_id": 1,
  "medicamento_id": 1,
  "prescrito_por": 2,
  "dosagem": "2 comprimidos",
  "data_inicio": "2026-04-10",
  "data_fim": "2026-05-10",
  "instrucoes": "Tomar de 6 em 6 horas",
  "estoque_atual": 25,
  "estoque_minimo": 5,
  "data_vencimento": null,
  "ativo": true,
  "frequencia": "DIÁRIO"
}
```

---

### 14. Atualizar Vital (PUT)

```bash
curl -X PUT "http://127.0.0.1:8000/registros-vitais/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "valor": 135.0,
    "observacao": "Após repouso de 5 minutos"
  }'
```

**Response 200:**
```json
{
  "id": 1,
  "paciente_id": 1,
  "registrado_por": 2,
  "tipo": "PRESSAO_SISTOLICA",
  "valor": 135.0,
  "unidade": "mmHg",
  "data_hora": "2026-04-10T14:30:00",
  "observacao": "Após repouso de 5 minutos"
}
```

---

### 15. Deletar Prescrição (DELETE - Soft Delete)

```bash
curl -X DELETE "http://127.0.0.1:8000/paciente-medicamentos/1" \
  -H "Authorization: Bearer {token}"
```

**Response 204:** (Sem conteúdo)

---

## �🔧 Variáveis de Ambiente

Criar arquivo `.env` em `backend/app/`:

```env
# PostgreSQL
POSTGRES_USER=capsule
POSTGRES_PASSWORD=capsule123
POSTGRES_DB=capsule_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT
SECRET_KEY=sua-chave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Ambiente
ENVIRONMENT=development
```

---

## 📚 Documentação Completa

Para documentação detalhada, consulte:
- **Swagger UI**: http://127.0.0.1:8000/docs (após iniciar a API)
- **ReDoc**: http://127.0.0.1:8000/redoc

