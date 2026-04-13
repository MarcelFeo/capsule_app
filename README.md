# ⚠️ PROJETO EM DESENVOLVIMENTO ⚠️

# Capsule App - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Setup e Instalação](#setup-e-instalação)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Autenticação e Segurança](#autenticação-e-segurança)
6. [Rotas da API](#rotas-da-api)
7. [Funcionalidade dos Arquivos](#funcionalidade-dos-arquivos)
8. [Modelo de Dados](#modelo-de-dados)
9. [Variáveis de Ambiente](#variáveis-de-ambiente)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

**Capsule App** é uma aplicação web para gerenciamento de saúde de pacientes, permitindo:
- Autenticação de usuários com JWT
- Gerenciamento de três tipos de usuários: **Pacientes**, **Cuidadores** e **Admins**
- CRUD completo de usuários, pacientes e cuidadores
- Perfis de usuários com dados médicos associados
- Controle de acesso baseado em roles

### Objetivos

- ✅ API REST com Python/FastAPI
- ✅ Autenticação JWT com controle de roles
- ✅ Banco de dados PostgreSQL em Docker
- ✅ CRUD para entidades principais
- ✅ Documentação automática com Swagger

---

## ⚙️ Stack Tecnológico

```
Backend:
├── Python 3.13
├── FastAPI 0.115.6
├── SQLAlchemy 2.0.36 (ORM)
├── Pydantic 2.10.3 (Validação)
├── python-jose 3.3.0 (JWT)
├── passlib + bcrypt (Autenticação)
├── psycopg2 (Driver PostgreSQL)
└── Alembic (Migrations)

Banco de Dados:
├── PostgreSQL 16 (Alpine)
├── Docker & Docker Compose
└── Healthcheck incluído

Frontend:
└── (A implementar)
```

---

## 🚀 Setup e Instalação

### Pré-requisitos

```bash
✓ Docker & Docker Compose
✓ Python 3.13+
✓ pip
✓ Git
```

### Instalação Rápida

#### 1. Clonar ou baixar o projeto

```bash
cd capsule_app
```

#### 2. Iniciar PostgreSQL com Docker

```bash
cd backend
docker-compose up -d
```

**Verificar:**
```bash
docker ps | findstr capsule_db
# Output: capsule_db rodando na porta 5432
```

#### 3. Instalar dependências Python

```bash
cd backend/app
pip install -r requirements.txt
```

#### 4. Iniciar a API

```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### 5. Acessar

- 🔗 **Swagger UI**: http://127.0.0.1:8000/docs
- 📚 **ReDoc**: http://127.0.0.1:8000/redoc
- 📡 **API**: http://127.0.0.1:8000

---

## 📁 Estrutura do Projeto

```
capsule_app/
├── README.md                          # Este arquivo
├── backend/
│   ├── docker-compose.yml             # Configuração Docker (PostgreSQL)
│   ├── DOCKER_SETUP.md                # Documentação Docker
│   ├── .env.docker                    # Vars para docker-compose
│   │
│   └── app/                           # Núcleo da aplicação
│       ├── main.py                    # Entrada FastAPI + inicialização DB
│       ├── config.py                  # Configurações (Settings, env vars)
│       ├── .env                       # Variáveis de ambiente (localhost)
│       ├── .env.local                 # Backup desenvolvimento local
│       ├── requirements.txt           # Dependências Python
│       ├── Dockerfile                 # Build da API (opcional)
│       ├── .dockerignore              # Arquivos ignorados em Docker
│       │
│       ├── domain/                    # Lógica de negócio
│       │   ├── models/
│       │   │   ├── user.py            # Modelo: Usuário
│       │   │   ├── patient.py         # Modelo: Paciente
│       │   │   └── caregiver.py       # Modelo: Cuidador
│       │   │
│       │   ├── schemas/               # Validação de dados (Pydantic)
│       │   │   ├── user_schema.py           # Schemas: Usuário
│       │   │   ├── patient_schema.py        # Schemas: Paciente
│       │   │   ├── caregiver_schema.py      # Schemas: Cuidador
│       │   │   └── user_patient_schema.py   # Schemas: User+Patient combinado
│       │   │
│       │   └── repositories/          # (Estrutura preparada para DAOs)
│       │
│       ├── infrastructure/            # Infraestrutura técnica
│       │   ├── database/
│       │   │   ├── connection.py      # Configuração SQLAlchemy + Engine
│       │   │   └── models/            # (Referência aos models)
│       │   │
│       │   └── security/
│       │       └── config.py          # (Configurações segurança)
│       │
│       ├── use_cases/                 # Endpoints e lógica de rotas
│       │   ├── auth/
│       │   │   ├── router.py          # Rota: POST /auth/login
│       │   │   ├── service.py         # Serviço: JWT + Hash
│       │   │   └── dependencies.py    # Dependências: Autenticação + Roles
│       │   │
│       │   ├── user/
│       │   │   └── users.py           # Rotas CRUD: /usuarios
│       │   │
│       │   ├── patient/
│       │   │   └── patients.py        # Rotas CRUD: /pacientes
│       │   │
│       │   └── caregiver/
│       │       └── caregivers.py      # Rotas CRUD: /cuidadores
│       │
│       └── alembic/                   # Migrations (em preparação)
│           └── env.py
│
└── frontend/                          # (A implementar)
    └── README.md
```

---

## 🔐 Autenticação e Segurança

### Fluxo de Autenticação

```
1. Usuário faz login
   POST /auth/login
   {
     "email": "usuario@exemplo.com",
     "senha": "senha123"
   }

2. API valida credenciais
   ✓ Email existe?
   ✓ Senha correta?
   ✓ Usuario ativo?

3. API retorna JWT Token
   {
     "access_token": "eyJhbGc...",
     "token_type": "bearer",
     "tipo_usuario": "PACIENTE"
   }

4. Cliente envia token em requisições
   Authorization: Bearer eyJhbGc...

5. API valida token em cada rota protegida
   ✓ Token válido?
   ✓ Token expirado?
   ✓ Usuário ativo?
   ✓ Permissão suficiente?
```

### Tipos de Usuários (Roles)

| Role | Descrição | Permissões |
|------|-----------|-----------|
| **PACIENTE** | Paciente de saúde | Ver/editar próprio perfil, ver medicamentos |
| **CUIDADOR** | Profissional de saúde | Ver todos os pacientes, criar/editar registros |
| **ADMIN** | Administrador | Gerenciar usuários, cuidadores e configurações |

### Segurança Implementada

✅ **Hashing de Senhas**: bcrypt (passlib)
✅ **JWT Token**: HS256 + expiração (60 min padrão)
✅ **Validação de Email**: EmailStr (Pydantic)
✅ **Role-Based Access Control**: Dependências customizadas
✅ **HTTP Bearer**: FastAPI HTTPBearer

---

## 🔌 Rotas da API

### Autenticação

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "paciente@exemplo.com",
  "senha": "senha123"
}

Response 200:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "tipo_usuario": "PACIENTE"
}
```

**Status**: ✅ Implementado
**Autenticação**: ❌ Não requerida
**Funcionalidade**: Autentica usuário e retorna JWT token válido por 60 minutos

---

### Usuários (Endpoints Administrativos)

#### Criar Usuário
```http
POST /usuarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "senha123",
  "tipo": "PACIENTE",
  "telefone": "11999999999",
  "foto_url": null
}

Response 201:
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "tipo": "PACIENTE",
  "ativo": true,
  "data_criacao": "2026-03-31T18:00:00"
}
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Cria novo usuário no sistema

#### Listar Usuários
```http
GET /usuarios?skip=0&limit=20
Authorization: Bearer {token}

Response 200: array de usuários
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Lista usuários com paginação

#### Obter Usuário por ID
```http
GET /usuarios/{user_id}
Authorization: Bearer {token}

Response 200: usuário específico
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Retorna dados de um usuário

#### Atualizar Usuário
```http
PUT /usuarios/{user_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva Atualizado",
  "email": "joao.novo@exemplo.com",
  "senha": "novaSenha123",
  "tipo": "PACIENTE",
  "telefone": "11988888888"
}

Response 200: usuário atualizado
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Atualiza dados do usuário

#### Deletar Usuário
```http
DELETE /usuarios/{user_id}
Authorization: Bearer {token}

Response 204: (sem conteúdo)
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Remove usuário do sistema

#### Criar Usuário + Perfil Paciente
```http
POST /usuarios/paciente
Content-Type: application/json

{
  "nome": "Maria Santos",
  "email": "maria@exemplo.com",
  "senha": "senha123",
  "telefone": "11987654321",
  "data_nascimento": "1990-05-15",
  "tipo_sanguineo": "O+",
  "telefone_emergencia": "11999999999",
  "contato_emergencia": "Mãe",
  "alergias": "Penicilina",
  "condicoes_medicas": "Hipertensão"
}

Response 201:
{
  "id": 2,
  "nome": "Maria Santos",
  "email": "maria@exemplo.com",
  "tipo": "PACIENTE",
  "ativo": true,
  "data_criacao": "2026-03-31T18:05:00",
  "paciente": {
    "id": 1,
    "usuario_id": 2,
    "data_nascimento": "1990-05-15",
    "tipo_sanguineo": "O+",
    ...
  }
}
```

**Status**: ✅ Implementado
**Autenticação**: ❌ Não requerida (Auto-registro)
**Funcionalidade**: Cria usuário com perfil de paciente em uma única requis​ição

---

### Pacientes

#### Criar Paciente
```http
POST /pacientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuario_id": 1,
  "data_nascimento": "1990-01-15",
  "tipo_sanguineo": "A+",
  "telefone_emergencia": "11999999999",
  "contato_emergencia": "Esposa",
  "observacoes": "Paciente diabético",
  "alergias": "Sulfas",
  "condicoes_medicas": "Diabetes tipo 2"
}

Response 201: paciente criado
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (CUIDADOR/ADMIN)
**Funcionalidade**: Cria registrómo médico para usuário

#### Listar Pacientes
```http
GET /pacientes?skip=0&limit=20
Authorization: Bearer {token}

Response 200: array de pacientes
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (CUIDADOR/ADMIN)
**Funcionalidade**: Lista todos os pacientes

#### Obter Paciente por ID
```http
GET /pacientes/{patient_id}
Authorization: Bearer {token}

Response 200: dados do paciente
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (CUIDADOR/ADMIN)
**Funcionalidade**: Retorna dados médicos de um paciente

#### Atualizar Paciente
```http
PUT /pacientes/{patient_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "tipo_sanguineo": "B+",
  "alergias": "Sulfas, Penicilina"
}

Response 200: paciente atualizado
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (CUIDADOR/ADMIN)
**Funcionalidade**: Atualiza dados médicos

#### Deletar Paciente
```http
DELETE /pacientes/{patient_id}
Authorization: Bearer {token}

Response 204: (sem conteúdo)
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (CUIDADOR/ADMIN)
**Funcionalidade**: Remove paciente

#### Ver Meu Perfil (Paciente)
```http
GET /pacientes/me
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "nome": "Maria Santos",
  "perfil": { paciente data }
}
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (PACIENTE)
**Funcionalidade**: Paciente vê seu próprio perfil

#### Atualizar Meu Perfil (Paciente)
```http
PUT /pacientes/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "alergias": "Penicilina",
  "observacoes": "Alergia descoberta recentemente"
}

Response 200: perfil atualizado
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (PACIENTE)
**Funcionalidade**: Paciente edita seu próprio perfil

---

### Cuidadores

#### Criar Cuidador
```http
POST /cuidadores
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuario_id": 3,
  "crm": "123456",
  "especialidade": "Cardiologia"
}

Response 201: cuidador criado
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Cria perfil de profissional de saúde

#### Listar Cuidadores
```http
GET /cuidadores?skip=0&limit=20
Authorization: Bearer {token}

Response 200: array de cuidadores
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Lista profissionais de saúde

#### Obter Cuidador por ID
```http
GET /cuidadores/{caregiver_id}
Authorization: Bearer {token}

Response 200: dados do cuidador
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Retorna dados do profissional

#### Atualizar Cuidador
```http
PUT /cuidadores/{caregiver_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "especialidade": "Cardiologia e Clínica Geral",
  "crm": "123456/SP"
}

Response 200: cuidador atualizado
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Atualiza dados do profissional

#### Deletar Cuidador
```http
DELETE /cuidadores/{caregiver_id}
Authorization: Bearer {token}

Response 204: (sem conteúdo)
```

**Status**: ✅ Implementado
**Autenticação**: ✅ Requerida (ADMIN)
**Funcionalidade**: Remove cuidador

---

## 📦 Funcionalidade dos Arquivos

### Backend

#### `main.py`
**Função**: Inicialização da aplicação FastAPI
**Responsabilidades**:
- Cria a instância FastAPI
- Inicializa o banco de dados (criar tabelas)
- Registra todos os routers
- Define a raiz da API

**Importações**:
```python
from fastapi import FastAPI
from app.infrastructure.database.connection import Base, engine
from app.use_cases.user import users
from app.use_cases.patient import patients
from app.use_cases.caregiver import caregivers
from app.use_cases.auth import router as auth_router
```

---

#### `config.py`
**Função**: Gerenciamento de configurações e variáveis de ambiente
**Responsabilidades**:
- Define classe `Settings` com Pydantic
- Carrega variáveis do arquivo `.env`
- Fornece `DATABASE_URL` construída
- Validação automática de vars obrigatórias

**Variáveis Gerenciadas**:
- Credenciais PostgreSQL
- Chaves JWT e algoritmo
- Timeout de tokens
- Ambiente (development/production)

---

#### `domain/models/user.py`
**Função**: Modelo SQLAlchemy para tabela `usuarios`
**Responsabilidades**:
- Define schema de usuário
- Coluna para cada atributo
- Relacionamento com Paciente e Cuidador
- Tipos: PACIENTE | CUIDADOR | ADMIN

**Colunas Principais**:
```python
id (Integer, PK)          # Identificador único
nome (String)             # Nome completo
email (String, UNIQUE)    # Email único
senha (String)            # Hash bcrypt
tipo (String)             # Tipo de usuário
telefone (String)         # Tel. contato
foto_url (String)         # URL da foto
ativo (Boolean)           # Status ativo/inativo
ultimo_login (DateTime)   # Último acesso
data_criacao (DateTime)   # Data de criação
```

---

#### `domain/models/patient.py`
**Função**: Modelo SQLAlchemy para tabela `pacientes`
**Responsabilidades**:
- Define dados médicos do paciente
- Faz referência a um usuário
- Armazena histórico de saúde

**Colunas Principais**:
```python
id (Integer, PK)
usuario_id (Integer, FK)        # Referência ao Usuário
data_nascimento (Date)          # Data de nascimento
tipo_sanguineo (String)         # Tipo sanguíneo
telefone_emergencia (String)    # Tel. para emergência
contato_emergencia (String)     # Nome do contato
observacoes (Text)              # Notas médicas
alergias (Text)                 # Lista de alergias
condicoes_medicas (Text)        # Condições de saúde
```

---

#### `domain/models/caregiver.py`
**Função**: Modelo SQLAlchemy para tabela `cuidadores`
**Responsabilidades**:
- Define dados do profissional de saúde
- Faz referência a um usuário
- Armazena credenciais profissionais

**Colunas Principais**:
```python
id (Integer, PK)
usuario_id (Integer, FK)   # Referência ao Usuário
crm (String)               # Número do CRM/Registro
especialidade (String)     # Especialidade médica
```

---

#### `domain/schemas/user_schema.py`
**Função**: Validação Pydantic para dados de usuário
**Responsabilidades**:
- Define estrutura de entrada/saída
- Valida email com EmailStr
- Separa senha em schema de criação
- Exclui senha em respostas

**Classes**:
```python
UserBase          # Campos básicos compartilhados
UserCreate        # Entrada com senha
UserResponse      # Saída sem senha (para API)
```

---

#### `domain/schemas/patient_schema.py`
**Função**: Validação Pydantic para dados de paciente
**Responsabilidades**:
- Valida dados médicos
- Define campos opcionais
- Separa schema de criação e atualização

**Classes**:
```python
PatientBase       # Campos básicos (opcionais)
PatientCreate     # Criação com usuario_id
PatientUpdate     # Atualização (todos opcionais)
PatientResponse   # Resposta da API
```

---

#### `domain/schemas/caregiver_schema.py`
**Função**: Validação Pydantic para dados de cuidador
**Responsabilidades**:
- Valida dados profissionais
- Define campos opcionais (CRM e especialidade)

**Classes**:
```python
CaregiverBase      # Campos básicos (opcionais)
CaregiverCreate    # Criação com usuario_id
CaregiverResponse  # Resposta da API
```

---

#### `domain/schemas/user_patient_schema.py`
**Função**: Schema combinado para User + Patient
**Responsabilidades**:
- Facilita criação de usuário com perfil paciente
- Combina dados de usuário e paciente
- Retorna usuário completo com paciente aninhado

**Classes**:
```python
UserWithPatientCreate    # Entrada combinada
UserWithPatientResponse  # Resposta com paciente
```

---

#### `infrastructure/database/connection.py`
**Função**: Configuração SQLAlchemy e engine do banco
**Responsabilidades**:
- Cria engine PostgreSQL
- Define SessionLocal para conexões
- Fornece função `get_db()` para dependências
- Exporta `Base` para modelos

**Componentes**:
```python
engine              # Engine SQLAlchemy conectado ao PostgreSQL
SessionLocal        # Factory de sessões
Base                # declarative_base() para modelos
get_db()            # Dependency injection para rotas
```

---

#### `use_cases/auth/service.py`
**Função**: Lógica de autenticação e JWT
**Responsabilidades**:
- Hash e verificação de senhas (bcrypt)
- Criação de tokens JWT
- Decodificação de tokens
- Tratamento de expiração

**Funções**:
```python
hash_senha()          # bcrypt hash
verificar_senha()     # Verifica bcrypt
criar_token()         # Cria JWT com expiração
decodificar_token()   # Extrai claims do JWT
```

---

#### `use_cases/auth/router.py`
**Função**: Endpoint de login
**Responsabilidades**:
- Rota POST /auth/login
- Valida credenciais
- Retorna token JWT

**Endpoint**:
```http
POST /auth/login
{
  "email": "usuario@exemplo.com",
  "senha": "senha123"
}
```

---

#### `use_cases/auth/dependencies.py`
**Função**: Autenticação e autorização de rotas
**Responsabilidades**:
- Extrai e valida JWT de requests
- Retorna usuário autenticado
- Verifica roles (PACIENTE/CUIDADOR/ADMIN)
- Lança exceções para acesso negado

**Funções**:
```python
get_usuario_atual()         # Usuario autenticado
exigir_paciente()           # Apenas PACIENTE
exigir_cuidador()           # Apenas CUIDADOR
exigir_admin()              # Apenas ADMIN
exigir_cuidador_ou_admin()  # CUIDADOR ou ADMIN
```

---

#### `use_cases/user/users.py`
**Função**: CRUD de usuários
**Responsabilidades**:
- POST /usuarios - Criar
- GET /usuarios - Listar
- GET /usuarios/{id} - Obter um
- PUT /usuarios/{id} - Atualizar
- DELETE /usuarios/{id} - Deletar
- POST /usuarios/paciente - Criar com perfil

**Features**:
- Hash automático de senhas
- Validação de email duplicado
- Proteção: apenas ADMIN
- Transações de banco

---

#### `use_cases/patient/patients.py`
**Função**: CRUD de pacientes
**Responsabilidades**:
- POST /pacientes - Criar
- GET /pacientes - Listar
- GET /pacientes/{id} - Obter um
- PUT /pacientes/{id} - Atualizar
- DELETE /pacientes/{id} - Deletar
- GET /pacientes/me - Perfil do paciente autenticado
- PUT /pacientes/me - Atualizar próprio perfil

**Features**:
- Proteção: CUIDADOR/ADMIN
- Endpoints /me para autocensura
- Atualização parcial com exclude_none

---

#### `use_cases/caregiver/caregivers.py`
**Função**: CRUD de cuidadores
**Responsabilidades**:
- POST /cuidadores - Criar
- GET /cuidadores - Listar
- GET /cuidadores/{id} - Obter um
- PUT /cuidadores/{id} - Atualizar
- DELETE /cuidadores/{id} - Deletar

**Features**:
- Proteção: apenas ADMIN
- Perfis de profissionais de saúde

---

#### `requirements.txt`
**Função**: Dependências Python do projeto
**Categorias**:
- Web Framework: FastAPI, Uvicorn
- Banco de Dados: SQLAlchemy, psycopg2, Alembic
- Validação: Pydantic, pydantic-settings
- Autenticação: python-jose, passlib, bcrypt, python-multipart
- Testes: pytest, pytest-asyncio, httpx, factory-boy, faker

---

#### `.env`
**Função**: Variáveis de ambiente para desenvolvimento
**Conteúdo**:
```env
POSTGRES_USER=capsule
POSTGRES_PASSWORD=capsule123
POSTGRES_DB=capsule_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=development
```

---

#### `Dockerfile`
**Função**: Containerizar a API FastAPI
**Stages**:
- Base: Python 3.13-slim
- Install: gcc, postgresql-client
- Copy: requirements.txt
- Install: pip install
- Copy: código
- Expose: porta 8000
- CMD: uvicorn

---

### Docker

#### `docker-compose.yml`
**Função**: Orquestração do PostgreSQL
**Serviço**:
- `db`: PostgreSQL 16-Alpine
- Porta: 5432
- Volume: postgres_data (persistência)
- Healthcheck: pg_isready
- Env vars: credenciais

---

## 🗄️ Modelo de Dados

### Diagrama ER (Entity-Relationship)

```
┌──────────────────────┐
│     USUARIOS         │
├──────────────────────┤
│ id (PK)              │
│ nome                 │
│ email (UNIQUE)       │
│ senha (hash)         │
│ tipo (enum)          │
│ telefone             │
│ foto_url             │
│ ativo                │
│ ultimo_login         │
│ data_criacao         │
└──────────────────────┘
    ▲          ▲
    │1         │1
    │          │
    │          ├─────────────────┐
    │          │                 │
    │    ┌─────────────┐    ┌──────────────────┐
    │    │  PACIENTES  │    │  CUIDADORES      │
    └────┤─────────────┤    ├──────────────────┤
         │ id (PK)     │    │ id (PK)          │
         │ usuario_id* │    │ usuario_id*      │
         │ data_nasc   │    │ crm              │
         │ tipo_sang   │    │ especialidade    │
         │ tel_emerg   │    └──────────────────┘
         │ contato_e   │
         │ obs         │
         │ alergias    │
         │ condicoes   │
         └─────────────┘

Chaves:
* = Foreign Key
PK = Primary Key
```

### Relacionamentos

| Tabela | Relacionamento | Para | Tipo |
|--------|---|---|---|
| PACIENTES | usuario_id | USUARIOS.id | 1:1 |
| CUIDADORES | usuario_id | USUARIOS.id | 1:1 |

---

## 🔧 Variáveis de Ambiente

### Banco de Dados

| Var | Padrão | Descrição |
|-----|--------|-----------|
| `POSTGRES_USER` | - | Usuário PostgreSQL |
| `POSTGRES_PASSWORD` | - | Senha PostgreSQL |
| `POSTGRES_DB` | - | Nome do banco |
| `POSTGRES_HOST` | `db` | Host (localhost/db/IP) |
| `POSTGRES_PORT` | `5432` | Porta PostgreSQL |

### Autenticação

| Var | Padrão | Descrição |
|-----|--------|-----------|
| `SECRET_KEY` | - | Chave secreta JWT (**MUDE EM PRODUÇÃO**) |
| `ALGORITHM` | `HS256` | Algoritmo de assinatura JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Expiração do token (minutos) |

### Aplicação

| Var | Padrão | Descrição |
|-----|--------|-----------|
| `ENVIRONMENT` | `development` | Ambiente (development/production) |

---

## 🐳 Docker

### Iniciar Serviços

```bash
cd backend
docker-compose up -d
```

### Parar Serviços

```bash
docker-compose stop
```

### Ver Logs

```bash
docker-compose logs db         # Logs PostgreSQL
docker logs capsule_db         # Container
```

### Acessar PostgreSQL

```bash
docker exec -it capsule_db psql -U capsule -d capsule_db
```

### Status

```bash
docker ps | findstr capsule_db
```

---

## 🎯 Próximos Passos

### Phase 1: Core (✅ Completo)
- ✅ Autenticação JWT
- ✅ CRUD Users/Patients/Caregivers
- ✅ Rotas protegidas com roles
- ✅ PostgreSQL com Docker

### Phase 2: Funcionalidades
- 🔄 Medicamentos para pacientes
- 🔄 Consultas/Agendamentos
- 🔄 Prescrições médicas
- 🔄 Relatórios

### Phase 3: Frontend
- ⏳ React ou Vue.js
- ⏳ Autenticação JWT no cliente
- ⏳ Dashboard para cada role
- ⏳ PWA/Mobile

### Phase 4: DevOps
- ⏳ CI/CD (GitHub Actions)
- ⏳ Deploy AWS/Heroku
- ⏳ Monitoring
- ⏳ Backup automático

---

## 🐛 Troubleshooting

### Erro: "could not translate host name 'localhost'"
**Solução**: Certifique-se que PostgreSQL está rodando
```bash
docker ps | findstr capsule_db
docker-compose restart db
```

### Erro: "Connection refused on 127.0.0.1:5432"
**Solução**: Aguarde completar startup (~10s) ou verifique logs
```bash
docker logs capsule_db
```

### Erro: "database does not exist"
**Solução**: Banco é criado automaticamente, mas verifique credenciais
```bash
# Conectar ao PostgreSQL
docker exec -it capsule_db psql -U capsule
```

### Erro: "Token inválido ou expirado"
**Solução**: Faça login novamente
```bash
POST /auth/login  # Obter novo token
```

### Erro: "Acesso exclusivo para admins"
**Solução**: Verifique permissão do usuário
```bash
GET /usuarios/me  # Retorna tipo de usuário
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Pydantic](https://docs.pydantic.dev/)
- [python-jose](https://github.com/mpdavis/python-jose)

### Ferramentas Úteis

- **Postman**: Testar APIs
- **DBeaver**: Gerenciar banco de dados
- **Docker Desktop**: Gerenciar containers graficamente
- **Swagger UI**: Testar rotas em http://127.0.0.1:8000/docs

---

## 📄 Licença

(A definir - sugestão: MIT ou Apache 2.0)

---

## 👥 Autores

- Desenvolvedores: Marcel Féo & Pedro Souza
- Data: Março de 2026

---

## 💬 Suporte

Para dúvidas ou bugs:
1. Verifique o Troubleshooting acima
2. Consulte os logs: `docker logs` ou console
3. Revise a documentação das bibliotecas
4. Abra uma issue no GitHub (quando disponível)

---

**Última atualização**: 313 de Abril de 2026
**Status**: ✅ Production Ready (Core API)
