# 📘 Guia Técnico - Metis LMS

Este guia centraliza toda a documentação técnica do projeto Metis LMS, incluindo setup, configuração de autenticação, execução com Docker, comandos úteis e troubleshooting.

---

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Execução do Projeto](#execução-do-projeto)
4. [Sistema de Autenticação](#sistema-de-autenticação)
5. [Guia de Desenvolvimento](#-guia-de-desenvolvimento)
6. [Troubleshooting](#-troubleshooting)
7. [Referência de Comandos](#-referência-de-comandos)

---

## Pré-requisitos

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Java 21+** (Opcional, para desenvolvimento local do backend)
- **Node.js 18+** e **pnpm** (Opcional, para desenvolvimento local do frontend)

---

## Configuração Inicial

### 1. Variáveis de Ambiente

Copie os arquivos de exemplo para criar os arquivos de configuração:

```bash
# Raiz do projeto
cp .env.example .env

# Backend (opcional, se for rodar localmente sem Docker)
cp backend/.env.example backend/.env

# Frontend (opcional, se for rodar localmente sem Docker)
cp web/.env.local.example web/.env.local
```

Edite o arquivo `.env` na raiz com suas credenciais. As variáveis **obrigatórias** são:

```bash
AZURE_CLIENT_ID=seu_client_id_do_azure
AZURE_CLIENT_SECRET=seu_client_secret_do_azure
AZURE_TENANT_ID=seu_tenant_id_do_azure # Não usado se endpoint for 'common'
JWT_SECRET=sua_chave_jwt_base64  # Gere com: openssl rand -base64 64
FRONTEND_CALLBACK_URL=http://localhost:3000/auth/callback
```

### 2. Configuração do Azure AD

Para que o login com Microsoft funcione, configure sua aplicação no [Azure Portal](https://portal.azure.com):

1.  **Supported Account Types**: Selecione `Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts`.
2.  **Redirect URI**: Adicione `http://localhost:8080/login/oauth2/code/microsoft` (Tipo Web).
3.  **Client Secret**: Gere um novo secret em "Certificates & secrets" e adicione ao `.env`.
4.  **API Permissions**: Adicione `openid`, `profile`, `email`, `User.Read` e conceda "Admin consent".

---

## Execução do Projeto

### Opção A: Infraestrutura via Docker + Apps Locais (Recomendado para Dev)

Esta opção permite hot-reload no backend e frontend.

1.  **Suba a infraestrutura (MongoDB e Redis):**
    ```bash
    docker-compose up -d mongo redis
    ```

2.  **Execute o Backend:**
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```

3.  **Execute o Frontend:**
    ```bash
    cd web
    npm install
    npm run dev
    ```

### Opção B: Tudo via Docker

Ideal para validar o ambiente completo ou para produção.

```bash
docker-compose up -d
```

### Acesso aos Serviços

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Mongo Express**: [http://localhost:8081](http://localhost:8081) (Login: `admin` / `admin123`)

---

## Sistema de Autenticação

O sistema utiliza **Microsoft OAuth2 + JWT**.

### Funcionalidades
- **Login**: Suporte a contas pessoais (@outlook.com) e organizacionais (@mackenzie.br).
- **Logout**: Invalidação de token via blacklist no Redis/Mongo.
- **Roles**: Controle de acesso (RBAC).

### Domínios Permitidos
Por padrão, o sistema aceita:
- `@mackenzie.br`
- `@mackenzista.com.br`
- `@outlook.com`

Para alterar, edite `backend/src/main/resources/application-dev.yaml`.

### Roles Automáticas
- `ROLE_USER`: Todos os usuários autenticados.
- `ROLE_STUDENT`: Emails `@mackenzista.com.br`.
- `ROLE_ADMIN`: Emails configurados na lista de admins no `application.yaml`.

---

## Guia de Desenvolvimento

### Backend (Spring Boot)

- **Compilar**: `./mvnw clean compile`
- **Testar**: `./mvnw test`
- **Rodar com profile dev**: `./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`

### Frontend (Next.js)

- **Instalar deps**: `pnpm install`
- **Dev server**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`

### Estrutura de Pastas Relevante

- `backend/src/main/java/com/metis/backend/auth/`: Lógica de autenticação.
- `web/context/AuthContext.tsx`: Contexto de autenticação no React.
- `web/components/ProtectedRoute.tsx`: Componente para proteger rotas.

---

## Troubleshooting

### Erro 401 Unauthorized no Login
- Verifique se `AZURE_CLIENT_SECRET` está correto e não expirou.
- Confirme se o Redirect URI no Azure Portal é exatamente `http://localhost:8080/login/oauth2/code/microsoft`.

### Erro "domain_not_allowed"
- O email utilizado não pertence à lista de domínios permitidos. Adicione o domínio em `application-dev.yaml` se necessário.

### Backend não conecta ao MongoDB/Redis
- Se rodando localmente, garanta que os containers `mongo` e `redis` estão de pé (`docker-compose ps`).
- Se rodando tudo no Docker, verifique os logs: `docker-compose logs backend`.

### Portas em uso
Se receber erro de porta em uso:
```bash
sudo lsof -i :8080  # Backend
sudo lsof -i :3000  # Frontend
sudo lsof -i :27017 # Mongo
```
Mate o processo ou altere a porta no `docker-compose.yml`.

---

## ⚡ Referência de Comandos

### Docker
```bash
# Iniciar infra
docker-compose up -d mongo redis

# Ver logs
docker-compose logs -f

# Parar tudo e remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### MongoDB (via Container)
```bash
# Acessar shell
docker exec -it metis-mongo mongosh

# Backup
docker exec metis-mongo mongodump --out=/data/backup --db=metis
```

### Redis (via Container)
```bash
# Acessar CLI
docker exec -it metis-redis redis-cli
```
