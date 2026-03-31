# Capsule App - Setup Docker PostgreSQL

## Visão Geral

A aplicação está configurada para trabalhar com PostgreSQL rodando em Docker.

## Arquitetura

```
┌─────────────────────────────────┐
│   API FastAPI (Local)           │
│   http://127.0.0.1:8000         │
│   uvicorn app.main:app          │
└──────────┬──────────────────────┘
           │
           │ localhost:5432
           │
┌──────────▼──────────────────────┐
│   PostgreSQL (Docker)           │
│   Container: capsule_db         │
│   Port: 5432                    │
└─────────────────────────────────┘
```

## Pré-requisitos

- Docker & Docker Compose instalados
- Python 3.13+
- pip

## Como Executar

### 1. Iniciar o PostgreSQL no Docker

```bash
cd backend
docker-compose up -d
```

**Verificar se está rodando:**
```bash
docker ps | findstr capsule_db
```

### 2. Instalar dependências Python (primeira vez)

```bash
cd backend/app
pip install -r requirements.txt
```

### 3. Iniciar a API

```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 4. Acessar a API

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## Configuração do Banco de Dados

### Arquivo `.env` (backend/app/.env)

```env
POSTGRES_USER=capsule
POSTGRES_PASSWORD=capsule123
POSTGRES_DB=capsule_db
POSTGRES_HOST=localhost       # PostgreSQL via Docker
POSTGRES_PORT=5432
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=development
```

### Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| POSTGRES_USER | capsule | Usuário do PostgreSQL |
| POSTGRES_PASSWORD | capsule123 | Senha do PostgreSQL |
| POSTGRES_DB | capsule_db | Nome do banco |
| POSTGRES_HOST | localhost | Host do PostgreSQL (localhost para local, db para docker-compose com API) |
| POSTGRES_PORT | 5432 | Porta do PostgreSQL |
| SECRET_KEY | - | Chave secreta para JWT (MUDE EM PRODUÇÃO) |

## Comandos Úteis

### Docker

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose stop

# Remover tudo
docker-compose down

# Ver logs do banco
docker-compose logs db

# Acessar shell do PostgerSQL via container
docker exec -it capsule_db psql -U capsule -d capsule_db
```

### Uvicorn

```bash
# Desenvolvimento com reload
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Produção
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Conectar ao Banco com DBeaver/PgAdmin

- **Host**: localhost
- **Port**: 5432
- **User**: capsule
- **Password**: capsule123
- **Database**: capsule_db

## Arquivos de Configuração

- **docker-compose.yml** - Configuração do Docker (apenas PostgreSQL)
- **.env** - Variáveis de ambiente
- **.env.local** - Backup para desenvolvimento local
- **.env.docker** - Backup para docker-compose com API

## Estrutura de Diretórios

```
backend/
├── docker-compose.yml          # Configuração Docker (PostgreSQL)
├── .env.docker                 # Vars para docker-compose completo
├── app/
│   ├── main.py                 # FastAPI app
│   ├── config.py               # Configurações
│   ├── .env                    # Variáveis de ambiente
│   ├── .env.local              # Vars para desenvolvimento local
│   ├── Dockerfile              # Docker para API
│   ├── requirements.txt        # Dependências Python
│   ├── domain/
│   │   ├── models/             # Modelos SQLAlchemy
│   │   ├── schemas/            # Schemas Pydantic
│   │   └── repositories/       # Repositórios
│   ├── infrastructure/
│   │   ├── database/           # Configuração BD
│   │   └── security/           # Segurança/JWT
│   └── use_cases/
│       ├── auth/               # Autenticação
│       ├── user/               # CRUD Usuários
│       ├── patient/            # CRUD Pacientes
│       └── caregiver/          # CRUD Cuidadores
```

## Próximos Passos

1. ✅ PostgreSQL rodando com Docker
2. ✅ API conectada ao banco
3. ✅ Autenticação JWT implementada
4. ✅ CRUD de Users, Patients e Caregivers
5. **TODO**: Migrations (Alembic)
6. **TODO**: Testes automatizados
7. **TODO**: Frontend React/Vue.js

## Troubleshooting

### Erro: "could not translate host name 'localhost' to address"
- Certifique-se que o PostgreSQL está rodando: `docker ps | findstr capsule_db`
- Reinicie o container: `docker-compose restart db`

### Erro: "Connection refused on 127.0.0.1:5432"
- O PostgreSQL pode não ter iniciado completamente
- Espere ~10 segundos e tente novamente
- Verifique com: `docker logs capsule_db`

### Erro: "database does not exist"
- O banco `capsule_db` será criado automaticamente pelo PostgreSQL
- Verifique as credenciais no `.env`

## Suporte

Para maiores informações, consulte:
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
