# Guia de Setup - Sistema de Autenticação Metis LMS

## 📋 Visão Geral

Sistema de autenticação completo implementado com:
- **Backend**: Spring Boot + Spring Security + OAuth2 + JWT + MongoDB
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Autenticação**: Microsoft Azure AD (OAuth2)
- **Domínios permitidos**: @mackenzie.br, @mackenzista.com.br, @outlook.com

## ✅ Requisitos Atendidos

### AUTH-RF1: Autenticação via email mackenzista
✅ Implementado via Microsoft OAuth2
- Usuários fazem login com conta Microsoft
- Sistema valida domínios permitidos
- Cria/atualiza usuário no MongoDB automaticamente

### AUTH-RF2: Logout
✅ Implementado
- Endpoint `/api/auth/logout` (backend)
- Função `logout()` no contexto de autenticação (frontend)
- Token adicionado à blacklist no MongoDB
- Limpeza completa de estado no frontend

### AUTH-RF3: Controle de acesso baseado em roles
✅ Implementado
- Sistema de roles: `ROLE_USER`, `ROLE_STUDENT`, `ROLE_ADMIN`, `ROLE_PROFESSOR`
- Middleware JWT valida roles em cada requisição
- Anotação `@PreAuthorize` disponível para endpoints
- Component `ProtectedRoute` para proteção de páginas no frontend
- Roles atribuídas automaticamente baseadas no email

## 🚀 Setup Rápido

### 1. Configurar Azure AD

1. Acesse [Azure Portal](https://portal.azure.com)
2. Vá em **Azure Active Directory** > **App registrations** > **New registration**
3. Configure:
   - Name: `Metis LMS`
   - Supported account types: `Accounts in any organizational directory and personal Microsoft accounts`
   - Redirect URI: `http://localhost:8080/login/oauth2/code/microsoft`
4. Copie **Application (client) ID** e **Directory (tenant) ID**
5. Vá em **Certificates & secrets** > **New client secret** e copie o valor
6. Vá em **API permissions** > Adicione:
   - `openid`, `profile`, `email`, `User.Read` (Microsoft Graph)
7. Clique em **Grant admin consent**

### 2. Configurar Variáveis de Ambiente

```bash
# Na raiz do projeto
cp .env.example .env

# Editar .env e adicionar credenciais do Azure
# AZURE_CLIENT_ID=...
# AZURE_CLIENT_SECRET=...
# AZURE_TENANT_ID=...
# JWT_SECRET=... (gerar com: openssl rand -base64 64)
```

### 3. Iniciar com Docker (Recomendado)

```bash
# Opção 1: Apenas infraestrutura (MongoDB + Redis)
# Para desenvolvimento com hot reload
docker-compose up -d mongo redis

# Backend (em outro terminal)
cd backend
./mvnw spring-boot:run

# Frontend (em outro terminal)  
cd web
pnpm install
pnpm dev
```

**OU**

```bash
# Opção 2: Todos os serviços com Docker
docker-compose up -d

# Ver logs
docker-compose logs -f
```

### 4. Testar

1. Acesse http://localhost:3000/login
2. Clique em "Entrar com Microsoft"
3. Faça login com uma conta permitida
4. Você será redirecionado para a página principal autenticado

📚 **Guia completo do Docker**: Veja `DOCKER.md` para mais detalhes sobre comandos, troubleshooting e produção.

## 📁 Arquivos Criados/Modificados

### Backend

#### Modelos (`backend/src/main/java/com/metis/backend/auth/models/`)
- ✅ `entities/UserEntity.java` - Entidade de usuário (MongoDB)
- ✅ `entities/TokenBlacklist.java` - Tokens invalidados
- ✅ `enums/Role.java` - Enum de roles
- ✅ `requests/RefreshTokenRequest.java` - DTO para refresh token
- ✅ `response/AuthResponse.java` - Resposta de autenticação
- ✅ `response/RefreshTokenResponse.java` - Resposta de refresh
- ✅ `response/CurrentUserResponse.java` - Dados do usuário atual
- ✅ `response/LoginUrlResponse.java` - URL de login OAuth2
- ✅ `response/AdminTestResponse.java` - Teste de admin

#### Repositórios (`backend/src/main/java/com/metis/backend/auth/repositories/`)
- ✅ `UserRepository.java` - CRUD de usuários
- ✅ `TokenBlacklistRepository.java` - Gerenciamento de blacklist

#### Serviços (`backend/src/main/java/com/metis/backend/auth/service/`)
- ✅ `JwtService.java` - Geração e validação de JWT
- ✅ `UserService.java` - Gerenciamento de usuários (implementa UserDetailsService)
- ✅ `AuthService.java` - Lógica de autenticação (login, logout, refresh)

#### Configuração (`backend/src/main/java/com/metis/backend/auth/config/`)
- ✅ `SecurityConfig.java` - Configuração do Spring Security
- ✅ `JwtAuthenticationFilter.java` - Filtro para validar JWT
- ✅ `OAuth2AuthenticationSuccessHandler.java` - Handler pós-login OAuth2

#### API
- ✅ `backend/src/main/java/com/metis/backend/api/AuthResource.java` - Endpoints de autenticação

#### Configuração
- ✅ `backend/src/main/resources/application-dev.yaml` - Configurações OAuth2 e JWT
- ✅ `backend/.env.example` - Exemplo de variáveis de ambiente

#### Documentação
- ✅ `backend/AUTHENTICATION.md` - Documentação completa de autenticação

### Frontend

#### Contexto e Hooks
- ✅ `web/context/AuthContext.tsx` - Contexto de autenticação React
- ✅ `web/lib/api.ts` - Cliente API com suporte a JWT

#### Páginas
- ✅ `web/app/login/page.tsx` - Página de login com Microsoft
- ✅ `web/app/auth/callback/page.tsx` - Callback OAuth2

#### Componentes
- ✅ `web/components/ProtectedRoute.tsx` - HOC para proteger rotas

#### Configuração
- ✅ `web/.env.local.example` - Exemplo de variáveis de ambiente

#### Documentação
- ✅ `web/README_AUTH.md` - Documentação de autenticação do frontend

## 🔐 Segurança Implementada

1. **JWT com assinatura HMAC-SHA256**
   - Access token: 24 horas de validade
   - Refresh token: 7 dias de validade
   - Tokens armazenados de forma segura

2. **Token Blacklist**
   - Tokens invalidados no logout
   - Armazenamento no MongoDB com TTL automático

3. **Validação de Domínios**
   - Apenas emails de domínios permitidos
   - Configurável via `application-dev.yaml`

4. **CORS Configurado**
   - Apenas origens específicas permitidas
   - Headers de autorização expostos

5. **Stateless API**
   - Sem sessões no servidor
   - Escalabilidade horizontal

6. **Roles e Permissões**
   - Atribuição automática baseada em email
   - Validação em nível de endpoint e componente

## 🎯 Roles Automáticas

O sistema atribui roles automaticamente:

- **ROLE_USER**: Todos os usuários autenticados
- **ROLE_STUDENT**: Emails `@mackenzista.com.br`
- **ROLE_ADMIN**: Emails listados em `metis.auth.admin-emails`
- **ROLE_PROFESSOR**: (Configurar manualmente no futuro)

## 📊 Endpoints Disponíveis

### Públicos
- `GET /api/auth/login` - Retorna URL de login OAuth2
- `GET /oauth2/authorization/microsoft` - Inicia fluxo OAuth2

### Autenticados (requerem JWT)
- `GET /api/auth/me` - Informações do usuário atual
- `POST /api/auth/refresh` - Renova access token
- `POST /api/auth/logout` - Invalida token
- `GET /api/auth/validate` - Valida token

### Admin
- `GET /api/auth/admin/test` - Teste de acesso admin

## 🧪 Como Testar Roles

### Backend (usando annotations)

```java
@GetMapping("/professores-only")
@PreAuthorize("hasRole('PROFESSOR')")
public ResponseEntity<String> professoresOnly() {
    return ResponseEntity.ok("Apenas professores");
}

@GetMapping("/admin-only")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<String> adminOnly() {
    return ResponseEntity.ok("Apenas administradores");
}
```

### Frontend (usando ProtectedRoute)

```tsx
<ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
  <AdminPanel />
</ProtectedRoute>

<ProtectedRoute requiredRoles={['ROLE_PROFESSOR']}>
  <TeacherDashboard />
</ProtectedRoute>
```

## 🐳 Docker

O projeto usa Docker para MongoDB e Redis. Veja o guia completo em `DOCKER.md`.

**Comandos rápidos:**

```bash
# Apenas infra (para desenvolvimento local)
docker-compose up -d mongo redis

# Todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

## 📝 Próximos Passos

1. **Implementar refresh token automático** no frontend
2. **Adicionar mais roles** conforme necessário
3. **Implementar recuperação de senha** (se necessário)
4. **Configurar produção** (HTTPS, domínios, etc.)
5. **Adicionar testes unitários** e de integração
6. **Implementar auditoria** de login/logout

## 🐛 Troubleshooting

### Erro "domain_not_allowed"
- Verifique se o email está em um domínio permitido
- Edite `application-dev.yaml` > `metis.auth.allowed-email-domains`

### Erro "Redirect URI mismatch"
- Verifique se a URL no Azure AD é `http://localhost:8080/login/oauth2/code/microsoft`
- A URL deve corresponder exatamente

### Frontend não conecta ao backend
- Verifique `NEXT_PUBLIC_API_URL` no `.env.local`
- Certifique-se de que o backend está rodando na porta 8080

### Token sempre inválido
- Verifique se `JWT_SECRET` é o mesmo no backend e está em base64
- Certifique-se de que MongoDB está acessível

## 📚 Documentação Adicional

- `backend/AUTHENTICATION.md` - Guia completo do backend
- `web/README_AUTH.md` - Guia completo do frontend
- [Spring Security OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

## ✨ Recursos Implementados

- ✅ Login com Microsoft (OAuth2)
- ✅ Logout com invalidação de token
- ✅ Refresh token
- ✅ Proteção de rotas por roles
- ✅ Validação de domínios de email
- ✅ Gerenciamento automático de usuários
- ✅ Token blacklist
- ✅ CORS configurado
- ✅ Integração frontend/backend completa
- ✅ Documentação completa

## 🎉 Conclusão

O sistema de autenticação está completamente funcional e pronto para uso. Todos os requisitos (AUTH-RF1, AUTH-RF2, AUTH-RF3) foram implementados com sucesso!

Para iniciar:
1. Configure o Azure AD
2. Configure as variáveis de ambiente
3. Inicie MongoDB e Redis
4. Inicie o backend e frontend
5. Faça login em http://localhost:3000/login

Qualquer dúvida, consulte a documentação detalhada em `backend/AUTHENTICATION.md` ou `web/README_AUTH.md`.
