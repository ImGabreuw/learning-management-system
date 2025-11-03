# 🐳 Guia Docker - Metis LMS

Este guia mostra como executar o Metis LMS usando Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### 1. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais
nano .env
```

Preencha as seguintes variáveis **obrigatórias**:

```bash
AZURE_CLIENT_ID=seu_client_id_do_azure
AZURE_CLIENT_SECRET=seu_client_secret_do_azure
AZURE_TENANT_ID=seu_tenant_id_do_azure
JWT_SECRET=sua_chave_jwt_base64  # Gere com: openssl rand -base64 64
```

### 2. Inicie os serviços

```bash
# Apenas MongoDB e Redis (para desenvolvimento local)
docker-compose up -d mongo redis

# OU todos os serviços (incluindo backend e frontend)
docker-compose up -d
```

### 3. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Mongo Express** (debug): http://localhost:8081 (usuário: `admin`, senha: `admin123`)

## 📦 Serviços Disponíveis

### MongoDB
- **Porta**: 27017
- **Database**: metis
- **Dados**: Persistidos em `.docker/mongodb/`

### Redis
- **Porta**: 6379
- **Dados**: Persistidos em `.docker/redis/`
- **Modo**: Append-only file (AOF) ativado

### Backend (Spring Boot)
- **Porta**: 8080
- **Profile**: dev
- **Conecta-se a**: MongoDB (mongo:27017) e Redis (redis:6379)

### Frontend (Next.js)
- **Porta**: 3000
- **API URL**: http://localhost:8080

### Mongo Express (Opcional)
- **Porta**: 8081
- **Ativação**: `docker-compose --profile debug up -d`
- **Credenciais**: admin/admin123

## 🛠️ Comandos Úteis

### Iniciar serviços

```bash
# Apenas infra (MongoDB + Redis) para dev local
docker-compose up -d mongo redis

# Todos os serviços
docker-compose up -d

# Com Mongo Express para debug
docker-compose --profile debug up -d
```

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas MongoDB
docker-compose logs -f mongo
```

### Parar serviços

```bash
# Parar todos
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados!)
docker-compose down -v
```

### Rebuild

```bash
# Rebuild de um serviço específico
docker-compose build backend

# Rebuild de todos e reiniciar
docker-compose up -d --build
```

### Acessar container

```bash
# Backend
docker exec -it metis-backend bash

# MongoDB
docker exec -it metis-mongo mongosh
```

## 🔧 Desenvolvimento Local

### Opção 1: Apenas Docker para Infra (Recomendado)

Rode apenas MongoDB e Redis no Docker, e o backend/frontend localmente:

```bash
# 1. Inicie apenas a infra
docker-compose up -d mongo redis

# 2. Backend (em outro terminal)
cd backend
./mvnw spring-boot:run

# 3. Frontend (em outro terminal)
cd web
pnpm dev
```

**Vantagens:**
- ✅ Hot reload no backend e frontend
- ✅ Debug mais fácil
- ✅ Logs diretos no terminal

### Opção 2: Tudo no Docker

```bash
# Inicie tudo
docker-compose up -d

# Veja os logs
docker-compose logs -f backend web
```

**Vantagens:**
- ✅ Ambiente idêntico à produção
- ✅ Isolamento completo
- ✅ Fácil de compartilhar

## 📊 Verificando o Status

```bash
# Ver containers rodando
docker-compose ps

# Ver uso de recursos
docker stats

# Verificar saúde do MongoDB
docker exec metis-mongo mongosh --eval "db.adminCommand('ping')"

# Verificar saúde do Redis
docker exec metis-redis redis-cli ping
```

## 🗄️ Gerenciamento de Dados

### Backup do MongoDB

```bash
# Backup
docker exec metis-mongo mongodump --out=/data/backup --db=metis

# Copiar backup para host
docker cp metis-mongo:/data/backup ./backup-$(date +%Y%m%d)
```

### Restaurar MongoDB

```bash
# Copiar backup para container
docker cp ./backup metis-mongo:/data/restore

# Restaurar
docker exec metis-mongo mongorestore /data/restore
```

### Limpar dados (CUIDADO!)

```bash
# Para todos os containers
docker-compose down

# Remove volumes (apaga TODOS os dados)
docker-compose down -v

# Remove também imagens
docker-compose down -v --rmi all
```

## 🐛 Troubleshooting

### "Port already in use"

```bash
# Descubra qual processo está usando a porta
sudo lsof -i :8080
sudo lsof -i :27017
sudo lsof -i :6379

# Ou use docker-compose com portas diferentes
# Edite docker-compose.yml:
# ports:
#   - "8081:8080"  # Backend na porta 8081 do host
```

### Backend não conecta ao MongoDB

```bash
# Verifique se o MongoDB está rodando
docker-compose ps mongo

# Veja os logs do MongoDB
docker-compose logs mongo

# Tente reiniciar
docker-compose restart mongo backend
```

### "Cannot connect to the Docker daemon"

```bash
# Inicie o Docker
sudo systemctl start docker

# Configure para iniciar automaticamente
sudo systemctl enable docker
```

### Rebuild completo (quando algo dá muito errado)

```bash
# Para tudo
docker-compose down

# Remove containers, redes, volumes e imagens
docker-compose down -v --rmi all

# Rebuild do zero
docker-compose up -d --build
```

## 🔒 Segurança

### Produção

Para produção, **SEMPRE**:

1. ✅ Use senhas fortes para MongoDB
2. ✅ Gere um JWT_SECRET novo e seguro
3. ✅ Configure firewall para portas expostas
4. ✅ Use HTTPS (reverse proxy como Nginx)
5. ✅ Não exponha portas desnecessárias
6. ✅ Use secrets manager para variáveis sensíveis
7. ✅ Configure MongoDB com autenticação

### Exemplo docker-compose para produção:

```yaml
services:
  mongo:
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    # Não exponha a porta diretamente
    # ports:
    #   - "27017:27017"
```

## 📈 Monitoramento

### Logs centralizados

```bash
# Todos os logs em tempo real
docker-compose logs -f

# Últimas 100 linhas
docker-compose logs --tail=100

# Apenas erros
docker-compose logs | grep ERROR
```

### Métricas

```bash
# CPU e memória em tempo real
docker stats

# Espaço em disco usado
docker system df
```

## 🚢 Deploy

### AWS ECS / Azure Container Instances

```bash
# Build e push para registry
docker-compose build
docker-compose push

# Use os arquivos ecs-task-definition.json incluídos
```

### Docker Swarm

```bash
# Inicialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml metis
```

### Kubernetes

```bash
# Gere manifests a partir do docker-compose
kompose convert

# Aplique
kubectl apply -f .
```

## 📝 Variáveis de Ambiente

Todas as variáveis podem ser configuradas no arquivo `.env`:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `AZURE_CLIENT_ID` | Client ID do Azure AD | `abc123...` |
| `AZURE_CLIENT_SECRET` | Client Secret do Azure AD | `xyz789...` |
| `AZURE_TENANT_ID` | Tenant ID do Azure AD | `def456...` |
| `JWT_SECRET` | Chave secreta JWT (base64) | `sua_chave_base64` |
| `FRONTEND_CALLBACK_URL` | URL de callback OAuth2 | `http://localhost:3000/auth/callback` |
| `NEXT_PUBLIC_API_URL` | URL da API (frontend) | `http://localhost:8080` |

## 🎯 Profiles

O docker-compose suporta profiles para diferentes ambientes:

```bash
# Desenvolvimento com debug (inclui Mongo Express)
docker-compose --profile debug up -d

# Apenas serviços principais
docker-compose up -d
```

## 📚 Mais Informações

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Spring Boot + Docker](https://spring.io/guides/gs/spring-boot-docker/)
- [Next.js + Docker](https://nextjs.org/docs/deployment#docker-image)

---

**Dica**: Para desenvolvimento rápido, use apenas `docker-compose up -d mongo redis` e rode o backend/frontend localmente para ter hot reload! 🚀
