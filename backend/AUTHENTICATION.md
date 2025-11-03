# Configuração de Autenticação - Metis

## Visão Geral

O sistema de autenticação do Metis utiliza:
- **OAuth2** com Microsoft Azure AD para login
- **JWT (JSON Web Tokens)** para autenticação de API
- **Spring Security** para controle de acesso
- **MongoDB** para armazenamento de usuários

## Domínios de Email Permitidos

Os seguintes domínios de email são permitidos para login:
- `@mackenzie.br`
- `@mackenzista.com.br`
- `@outlook.com`

## Configuração do Azure AD

### 1. Criar uma aplicação no Azure Portal

1. Acesse o [Azure Portal](https://portal.azure.com)
2. Navegue até **Azure Active Directory** > **App registrations**
3. Clique em **New registration**
4. Configure:
   - **Name**: Metis LMS
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: 
     - Platform: Web
     - URI: `http://localhost:8080/login/oauth2/code/microsoft`

### 2. Configurar a aplicação

1. Na página da aplicação, copie o **Application (client) ID**
2. Copie o **Directory (tenant) ID**
3. Vá em **Certificates & secrets** > **Client secrets** > **New client secret**
4. Copie o valor do secret (só aparece uma vez!)

### 3. Configurar permissões

1. Vá em **API permissions**
2. Adicione as seguintes permissões do Microsoft Graph (Delegated):
   - `openid`
   - `profile`
   - `email`
   - `User.Read`
3. Clique em **Grant admin consent**

### 4. Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` com base no `.env.example`:

```bash
# Azure AD Configuration
AZURE_CLIENT_ID=seu_application_client_id_aqui
AZURE_CLIENT_SECRET=seu_client_secret_aqui
AZURE_TENANT_ID=seu_directory_tenant_id_aqui

# JWT Configuration
# Gere uma chave secreta base64 forte (mínimo 256 bits)
JWT_SECRET=sua_chave_secreta_jwt_base64_aqui

# Frontend Configuration
FRONTEND_CALLBACK_URL=http://localhost:3000/auth/callback
```

#### Como gerar uma JWT_SECRET:

```bash
# Linux/Mac
openssl rand -base64 64

# Ou use um gerador online confiável
```

## Fluxo de Autenticação

1. **Usuário clica em "Entrar com Microsoft"** no frontend (`/login`)
2. Frontend redireciona para `/oauth2/authorization/microsoft` no backend
3. Backend redireciona para Microsoft Azure AD
4. Usuário faz login no Microsoft
5. Microsoft redireciona de volta para o backend com authorization code
6. Backend troca o code por tokens OAuth2
7. Backend valida o email do usuário (domínio permitido)
8. Backend cria/atualiza o usuário no MongoDB
9. Backend gera tokens JWT (access + refresh)
10. Backend redireciona para o frontend com os tokens na URL
11. Frontend salva os tokens no localStorage
12. Frontend busca informações do usuário via `/api/auth/me`
13. Usuário está autenticado!

## Endpoints de API

### Públicos (sem autenticação)

- `GET /api/auth/login` - Retorna a URL de login OAuth2
- `GET /oauth2/authorization/microsoft` - Inicia o fluxo OAuth2

### Autenticados (requerem JWT token)

- `GET /api/auth/me` - Retorna informações do usuário atual
- `POST /api/auth/refresh` - Renova o access token usando refresh token
- `POST /api/auth/logout` - Faz logout e invalida o token
- `GET /api/auth/validate` - Valida se o token é válido

### Admin apenas

- `GET /api/auth/admin/test` - Endpoint de teste para admins

## Roles (Papéis)

O sistema define automaticamente roles baseado no email:

- `ROLE_USER` - Todos os usuários autenticados
- `ROLE_STUDENT` - Usuários com email `@mackenzista.com.br`
- `ROLE_ADMIN` - Usuários listados em `metis.auth.admin-emails`

### Configurar admins

Edite `application-dev.yaml`:

```yaml
metis:
  auth:
    admin-emails:
      - admin@mackenzie.br
      - seu.email@mackenzie.br
```

## Segurança

### JWT Tokens

- **Access Token**: Expira em 24 horas
- **Refresh Token**: Expira em 7 dias
- Tokens invalidados vão para uma blacklist no MongoDB

### CORS

O backend aceita requisições de:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://metis.app` (produção)

Para adicionar outras origens, edite `SecurityConfig.java`.

## Testando localmente

1. Certifique-se de que MongoDB e Redis estão rodando
2. Configure o arquivo `.env`
3. Inicie o backend: `./mvnw spring-boot:run`
4. Inicie o frontend: `cd web && pnpm dev`
5. Acesse `http://localhost:3000/login`
6. Clique em "Entrar com Microsoft"
7. Faça login com uma conta Microsoft permitida

## Troubleshooting

### "Email não está em um domínio permitido"

- Verifique se o email está nos domínios configurados em `application-dev.yaml`
- Emails pessoais (@outlook.com, @hotmail.com) devem estar explicitamente permitidos

### "Token inválido ou expirado"

- O token JWT expirou (24h para access, 7d para refresh)
- Faça login novamente

### "Redirect mismatch error" no Azure

- Verifique se a URL de redirect no Azure (`http://localhost:8080/login/oauth2/code/microsoft`) está correta
- A URL deve corresponder exatamente (incluindo protocolo e porta)

### Logs

Para ver logs detalhados de autenticação, verifique:
- Console do backend (nível DEBUG para `com.metis.backend`)
- Arquivo `logs/app.log`

## Produção

Para produção, atualize:

1. **Azure AD**: Adicione a URL de produção nos redirect URIs
2. **application.yaml**: Use perfil `prod` com URLs de produção
3. **Variáveis de ambiente**: Use secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)
4. **CORS**: Adicione o domínio de produção em `SecurityConfig.java`
5. **HTTPS**: Certifique-se de usar HTTPS em produção

```yaml
# application-prod.yaml
custom:
  oauth2:
    frontend-callback-url: https://metis.app/auth/callback
```
