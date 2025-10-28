# 📋 Guia de Teste de Integração - ALF (Autenticação, Login e Funcionalidades)

## 📌 Visão Geral

Este documento fornece um guia **PRÁTICO E COMPLETO** para testar o sistema de autenticação do Metis **sem precisar de frontend rodando**.

### 🎯 Por que Testamos Assim?

**Problema:** Queremos testar nossa API de autenticação, mas enfrentamos um desafio técnico:

- Nossa API usa **JWT stateless** (`SessionCreationPolicy.STATELESS`) - sem sessões HTTP
- OAuth2 do Spring Security precisa de **sessões HTTP** para funcionar
- Incompatibilidade arquitetural entre os dois

**Por que não testamos OAuth2 completo via terminal?**

O fluxo OAuth2 com Microsoft Azure AD envolve:
1. Redirecionamento para página de login da Microsoft
2. Usuário faz login (interface gráfica)
3. Microsoft redireciona de volta com código
4. Backend troca código por tokens
5. Spring Security precisa de **sessão HTTP** para armazenar `state` (proteção CSRF) e contexto

Isso é **impossível de testar via `curl`** porque:
- ❌ Não há como abrir navegador e fazer login interativo
- ❌ Não há sessão HTTP (nossa API é stateless)
- ❌ Callbacks OAuth2 precisam de contexto de sessão

**Nossa Solução: Endpoints de Desenvolvimento**

Criamos endpoints `/api/dev/**` que:
- ✅ Geram tokens JWT diretamente (simulando o que o OAuth2 faria)
- ✅ Permitem testar **100% da lógica de autorização** (validação, roles, refresh, logout)
- ✅ Funcionam apenas em ambiente `dev` (segurança)
- ✅ Testam o **core do sistema** sem comprometer a arquitetura

**Em produção:** O frontend usará OAuth2 real e receberá tokens. Toda a lógica de validação/autorização que testamos aqui funcionará perfeitamente!

### 🎯 Estratégia de Teste

Como o OAuth2 completo requer sessão HTTP (incompatível com JWT stateless), criamos **endpoints de desenvolvimento** que geram tokens diretamente, permitindo testar toda a lógica de autenticação/autorização.

**⚠️ IMPORTANTE: Por que não testamos OAuth2 completo?**
- OAuth2 do Spring Security requer `SessionCreationPolicy.IF_REQUIRED`
- Nossa API usa JWT com `SessionCreationPolicy.STATELESS` (sem sessão)
- Incompatibilidade entre OAuth2 stateful e JWT stateless
- **Solução**: Endpoint `/api/dev/auth/generate-token` (apenas perfil `dev`) para gerar tokens e testar o resto do sistema

**✅ O que TESTAMOS neste guia:**
1. ✅ **Geração de tokens JWT** (via endpoint dev)
2. ✅ **Validação de tokens JWT**
3. ✅ **Refresh de tokens**
4. ✅ **Logout** (invalidação de tokens)
5. ✅ **Proteção de rotas por role** (ROLE_USER e ROLE_ADMIN)
6. ✅ **Obtenção de dados do usuário autenticado**
7. ✅ **Validação de domínio** (@mackenzie.br e @mackenzista.com.br)
8. ✅ **Filtros de segurança JWT**

**❌ O que NÃO testamos (limitações técnicas):**
- ❌ Fluxo OAuth2 completo com Microsoft (requer frontend + sessão HTTP)
- ❌ Callback do Azure AD com Spring Security
- ❌ Interface visual de login

---

## 🔧 Pré-requisitos

### 1. Serviços Necessários

Execute os seguintes comandos para verificar se tudo está rodando:

```bash
# Verificar MongoDB
docker ps | grep metis-mongo

# Verificar Redis
docker ps | grep metis-redis

# Se não estiverem rodando, inicie:
cd /home/lucasfc/Vídeos/learning-management-system
docker-compose up -d mongo redis
```

**Resultado esperado:**
```
metis-redis   Up X hours   0.0.0.0:6379->6379/tcp
metis-mongo   Up X hours   0.0.0.0:27017->27017/tcp
```

### 2. Iniciar o Backend

```bash
cd /home/lucasfc/Vídeos/learning-management-system/backend
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```

**Aguarde até ver:**
```
Started BackendApplication in X.XXX seconds
```

### 3. Ferramentas Necessárias

- `curl` - para fazer requisições HTTP
- `jq` - para formatar JSON (opcional, mas recomendado)

```bash
# Instalar jq se necessário
sudo dnf install jq -y  # Fedora/Nobara
```

---

## 🧪 Testes Passo a Passo

### 📝 **Teste 1: Gerar Token para Usuário Comum**

**Objetivo:** Criar um usuário com role `ROLE_USER` e obter tokens JWT.

```bash
curl -s -X GET "http://localhost:8080/api/dev/auth/generate-token?email=user.teste@mackenzie.br" | jq .
```

**Resultado esperado:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "userInfo": {
    "email": "user.teste@mackenzie.br",
    "name": "Dev User - user.teste",
    "roles": [
      "ROLE_USER"
    ]
  }
}
```

**✅ Teste passou se:**
- Recebeu `accessToken` e `refreshToken`
- `tokenType` é "Bearer"
- `expiresIn` é 86400 (24 horas em segundos)
- `roles` contém "ROLE_USER"

**💾 Salve o accessToken:**
```bash
export USER_TOKEN="<copie_o_accessToken_aqui>"
```

---

### 📝 **Teste 2: Gerar Token para Administrador**

**Objetivo:** Criar um usuário com role `ROLE_ADMIN`.

```bash
curl -s -X GET "http://localhost:8080/api/dev/auth/generate-admin-token" | jq .
```

**Resultado esperado:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "userInfo": {
    "email": "admin@mackenzie.br",
    "name": "Dev User - admin",
    "roles": [
      "ROLE_USER",
      "ROLE_ADMIN"
    ]
  }
}
```

**✅ Teste passou se:**
- `roles` contém "ROLE_USER" e "ROLE_ADMIN"

**💾 Salve o accessToken:**
```bash
export ADMIN_TOKEN="<copie_o_accessToken_aqui>"
```

---

### 📝 **Teste 3: Validar Domínio de Email**

**Objetivo:** Verificar se apenas emails @mackenzie.br e @mackenzista.com.br são aceitos.

**✅ Teste com domínio válido:**
```bash
curl -s -X GET "http://localhost:8080/api/dev/auth/generate-token?email=teste@mackenzista.com.br" | jq .
```

**Resultado esperado:** Retorna tokens normalmente.

**❌ Teste com domínio inválido:**
```bash
curl -s -X GET "http://localhost:8080/api/dev/auth/generate-token?email=teste@gmail.com" | jq .
```

**Resultado esperado:**
```json
{
  "accessToken": null,
  "refreshToken": null,
  "tokenType": null,
  "expiresIn": null,
  "userInfo": null
}
```

**✅ Teste passou se:**
- Domínios @mackenzie.br e @mackenzista.com.br são aceitos
- Outros domínios são rejeitados

---

### 📝 **Teste 4: Obter Dados do Usuário Autenticado**

**Objetivo:** Verificar endpoint `/api/auth/me` que retorna informações do usuário logado.

**Usando token de usuário comum:**
```bash
curl -s -X GET "http://localhost:8080/api/auth/me" \
  -H "Authorization: Bearer $USER_TOKEN" | jq .
```

**Resultado esperado:**
```json
{
  "email": "user.teste@mackenzie.br",
  "name": "Dev User - user.teste",
  "roles": [
    "ROLE_USER"
  ],
  "enabled": true,
  "lastLoginAt": "2025-10-28T20:03:59.123456"
}
```

**✅ Teste passou se:**
- Retorna dados corretos do usuário
- Status code: 200 OK

**❌ Teste sem token:**
```bash
curl -s -X GET "http://localhost:8080/api/auth/me"
```

**Resultado esperado:** Status code 401 Unauthorized ou 403 Forbidden

---

### 📝 **Teste 5: Validar Token**

**Objetivo:** Verificar se o token é válido.

```bash
curl -s -X GET "http://localhost:8080/api/auth/validate" \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Resultado esperado:** Status code 200 OK (sem corpo)

**❌ Teste com token inválido:**
```bash
curl -s -X GET "http://localhost:8080/api/auth/validate" \
  -H "Authorization: Bearer token_invalido_123"
```

**Resultado esperado:** Status code 401 Unauthorized

---

### 📝 **Teste 6: Proteção de Rota - Acesso Permitido**

**Objetivo:** Verificar que usuário comum pode acessar rotas normais.

```bash
curl -s -X GET "http://localhost:8080/api/auth/me" \
  -H "Authorization: Bearer $USER_TOKEN" | jq .
```

**Resultado esperado:** Status code 200 OK

---

### 📝 **Teste 7: Proteção de Rota - Acesso Negado (ROLE_ADMIN)**

**Objetivo:** Verificar que usuário comum NÃO pode acessar rotas de admin.

```bash
curl -s -X GET "http://localhost:8080/api/auth/admin/test" \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Resultado esperado:** Status code 403 Forbidden

```json
{
  "timestamp": "2025-10-28T23:00:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "path": "/api/auth/admin/test"
}
```

---

### 📝 **Teste 8: Acesso Admin - Permitido**

**Objetivo:** Verificar que administrador PODE acessar rotas de admin.

```bash
curl -s -X GET "http://localhost:8080/api/auth/admin/test" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
```

**Resultado esperado:**
```json
{
  "user": "admin@mackenzie.br"
}
```

**✅ Teste passou se:**
- Retorna dados
- Status code: 200 OK

---

### 📝 **Teste 9: Refresh Token**

**Objetivo:** Usar refresh token para obter novo access token.

**1. Gerar token inicial e salvar refresh token:**
```bash
RESPONSE=$(curl -s -X GET "http://localhost:8080/api/dev/auth/generate-user-token")
REFRESH_TOKEN=$(echo $RESPONSE | jq -r '.refreshToken')
echo "Refresh Token: $REFRESH_TOKEN"
```

**2. Usar refresh token:**
```bash
curl -s -X POST "http://localhost:8080/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}" | jq .
```

**Resultado esperado:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

**✅ Teste passou se:**
- Retorna novo `accessToken`
- `tokenType` é "Bearer"
- Status code: 200 OK

---

### 📝 **Teste 10: Logout (Invalidação de Token)**

**Objetivo:** Invalidar um token (adicionar à blacklist).

**1. Fazer logout:**
```bash
curl -s -X POST "http://localhost:8080/api/auth/logout" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -v
```

**Resultado esperado:** Status code 204 No Content

**2. Tentar usar o token invalidado:**
```bash
curl -s -X GET "http://localhost:8080/api/auth/me" \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Resultado esperado:** Status code 401 Unauthorized

**✅ Teste passou se:**
- Logout retorna 204
- Token não funciona mais após logout

---

### 📝 **Teste 11: Token Expirado**

**Objetivo:** Verificar comportamento com token expirado (simulação).

> **Nota:** Tokens têm validade de 24h. Para testar expiração, você precisaria:
> 1. Modificar `metis.jwt.expiration` para 1000 (1 segundo)
> 2. Gerar token
> 3. Aguardar 2 segundos
> 4. Tentar usar o token

**Teste manual (opcional):**
1. Edite `application-dev.yaml`: `expiration: 1000`
2. Reinicie a aplicação
3. Gere token
4. Aguarde 2 segundos
5. Tente usar o token

**Resultado esperado:** Status code 401 Unauthorized

---

### 📝 **Teste 12: Múltiplos Usuários Simultâneos**

**Objetivo:** Verificar isolamento entre usuários.

**1. Criar usuário 1:**
```bash
USER1=$(curl -s -X GET "http://localhost:8080/api/dev/auth/generate-token?email=user1@mackenzie.br")
TOKEN1=$(echo $USER1 | jq -r '.accessToken')
```

**2. Criar usuário 2:**
```bash
USER2=$(curl -s -X GET "http://localhost:8080/api/dev/auth/generate-token?email=user2@mackenzie.br")
TOKEN2=$(echo $USER2 | jq -r '.accessToken')
```

**3. Verificar dados do usuário 1:**
```bash
curl -s -X GET "http://localhost:8080/api/auth/me" \
  -H "Authorization: Bearer $TOKEN1" | jq -r '.email'
```

**Resultado esperado:** `user1@mackenzie.br`

**4. Verificar dados do usuário 2:**
```bash
curl -s -X GET "http://localhost:8080/api/auth/me" \
  -H "Authorization: Bearer $TOKEN2" | jq -r '.email'
```

**Resultado esperado:** `user2@mackenzie.br`

**✅ Teste passou se:**
- Cada token retorna dados do seu respectivo usuário
- Não há vazamento de informações entre usuários

---

## 🔍 Verificação no MongoDB

### Ver Usuários Criados

```bash
# Conectar ao MongoDB
mongosh mongodb://localhost:27017/metis

# Listar usuários
db.users.find({}, {email: 1, name: 1, roles: 1, _id: 0}).pretty()
```

**Resultado esperado:**
```javascript
[
  {
    email: 'user.teste@mackenzie.br',
    name: 'Dev User - user.teste',
    roles: [ { _id: ObjectId('...'), name: 'ROLE_USER', ... } ]
  },
  {
    email: 'admin@mackenzie.br',
    name: 'Dev User - admin',
    roles: [
      { _id: ObjectId('...'), name: 'ROLE_USER', ... },
      { _id: ObjectId('...'), name: 'ROLE_ADMIN', ... }
    ]
  }
]
```

### Ver Tokens Invalidados

```bash
# No MongoDB
db.users.find(
  { invalidatedTokens: { $exists: true, $ne: [] } },
  { email: 1, invalidatedTokens: 1, _id: 0 }
).pretty()
```

---

## 📊 Resumo dos Endpoints Testados

| Endpoint | Método | Autenticação | Descrição |
|----------|--------|--------------|-----------|
| `/api/dev/auth/generate-token?email=X` | GET | ❌ Não | Gera tokens para email específico (dev only) |
| `/api/dev/auth/generate-admin-token` | GET | ❌ Não | Gera tokens para admin (dev only) |
| `/api/dev/auth/generate-user-token` | GET | ❌ Não | Gera tokens para user comum (dev only) |
| `/api/auth/me` | GET | ✅ Sim | Retorna dados do usuário autenticado |
| `/api/auth/validate` | GET | ✅ Sim | Valida se o token é válido |
| `/api/auth/refresh` | POST | ❌ Não | Gera novo access token usando refresh token |
| `/api/auth/logout` | POST | ✅ Sim | Invalida o token atual |
| `/api/auth/admin/test` | GET | ✅ Sim (ADMIN) | Endpoint de teste para administradores |

---

## ⚠️ Importante: Segurança

**Os endpoints `/api/dev/**` são APENAS para desenvolvimento!**

Eles estão protegidos pelo profile `@Profile("dev")` e só funcionam quando a aplicação é iniciada com:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Em produção (profile `prod`):**
- Endpoints `/api/dev/**` não existem
- Apenas autenticação OAuth2 real funcionará
- Tokens só podem ser obtidos via fluxo OAuth2 completo

---

## 🎯 Checklist de Testes

Use este checklist para garantir que todos os testes foram executados:

- [ ] **Teste 1:** Gerar token para usuário comum
- [ ] **Teste 2:** Gerar token para administrador
- [ ] **Teste 3:** Validar domínio de email
- [ ] **Teste 4:** Obter dados do usuário autenticado
- [ ] **Teste 5:** Validar token
- [ ] **Teste 6:** Proteção de rota - acesso permitido
- [ ] **Teste 7:** Proteção de rota - acesso negado (ROLE_ADMIN)
- [ ] **Teste 8:** Acesso admin - permitido
- [ ] **Teste 9:** Refresh token
- [ ] **Teste 10:** Logout (invalidação de token)
- [ ] **Teste 11:** Token expirado (opcional)
- [ ] **Teste 12:** Múltiplos usuários simultâneos
- [ ] **Verificação:** Usuários criados no MongoDB
- [ ] **Verificação:** Tokens invalidados no MongoDB

---

## 🐛 Troubleshooting

### Problema: "Connection refused" ao testar

**Solução:** Verifique se a aplicação está rodando:
```bash
curl http://localhost:8080/actuator/health
```

### Problema: MongoDB não conecta

**Solução:** Verifique se o MongoDB está rodando:
```bash
docker ps | grep metis-mongo
```

### Problema: Token retorna null

**Solução:** Verifique se o email tem domínio válido (@mackenzie.br ou @mackenzista.com.br)

### Problema: 401 Unauthorized em todas as requisições

**Solução:** Verifique se o token foi copiado corretamente e está no formato:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 📝 Notas Finais

### Por que criamos `/api/dev/auth/generate-token`?

O OAuth2 do Spring Security requer sessão HTTP para:
1. Armazenar o `state` (proteção CSRF)
2. Manter contexto durante o callback
3. Validar o fluxo de autorização

Nossa API usa JWT com `SessionCreationPolicy.STATELESS`, o que é incompatível com OAuth2 stateful.

**Opções:**
1. ✅ **Atual:** Endpoints dev para gerar tokens e testar lógica JWT
2. ❌ Mudar para `SessionCreationPolicy.IF_REQUIRED` (quebra arquitetura stateless)
3. ❌ Implementar OAuth2 manualmente (complexo e propenso a erros)

A solução escolhida permite testar **100% da lógica de autorização** sem comprometer a arquitetura.

### Próximos Passos

Quando o frontend estiver pronto:
1. Frontend fará login via OAuth2
2. Receberá tokens do backend
3. Usará tokens para chamar API
4. Todos os endpoints de proteção/validação já estarão testados e funcionando!

---

**Documentado em:** 28 de outubro de 2025  
**Versão:** 2.0 (Com endpoints de desenvolvimento)
