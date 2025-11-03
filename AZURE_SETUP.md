# ✅ Configuração Azure AD - Contas Pessoais e Organizacionais

## 🎯 Resumo da Configuração

O sistema está configurado para aceitar:
- ✅ Contas Microsoft pessoais (@outlook.com, @hotmail.com, @live.com)
- ✅ Contas organizacionais (@mackenzie.br, @mackenzista.com.br)
- ✅ Qualquer conta Azure AD

## 📋 Checklist de Configuração no Azure Portal

### 1. Supported Account Types
No Azure Portal → App registrations → Seu app → **Authentication**:

Deve estar selecionado:
```
✅ Accounts in any organizational directory (Any Azure AD directory - Multitenant) 
   and personal Microsoft accounts (e.g. Skype, Xbox)
```

**NÃO use:**
- ❌ Accounts in this organizational directory only (Single tenant)
- ❌ Accounts in any organizational directory (Multitenant)

### 2. Redirect URIs
Em **Authentication** → **Platform configurations** → **Web** → **Redirect URIs**:

Deve ter exatamente:
```
http://localhost:8080/login/oauth2/code/microsoft
```

### 3. API Permissions
Em **API permissions**, deve ter:
- ✅ `openid` (Delegated)
- ✅ `profile` (Delegated)
- ✅ `email` (Delegated)
- ✅ `User.Read` (Delegated)

**Importante:** Clique em "Grant admin consent" se houver um aviso.

### 4. Client Secret
Em **Certificates & secrets** → **Client secrets**:
- Deve ter um secret **ativo** (não expirado)
- O valor deve estar no arquivo `.env` como `AZURE_CLIENT_SECRET`

## 🔧 Configuração do Backend

O backend está configurado para usar o endpoint `common`:

```yaml
# application-dev.yaml
authorization-uri: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
token-uri: https://login.microsoftonline.com/common/oauth2/v2.0/token
```

Isso permite que **qualquer** conta Microsoft funcione, seja pessoal ou organizacional.

## 🧪 Testando

1. **Inicie os serviços:**
   ```bash
   # Terminal 1 - MongoDB e Redis
   docker-compose up -d mongo redis
   
   # Terminal 2 - Backend
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   
   # Terminal 3 - Frontend
   cd web
   npm run dev
   ```

2. **Acesse:** http://localhost:3000/login

3. **Clique em "Entrar com Microsoft"**

4. **Faça login com qualquer conta:**
   - Conta pessoal: seuemail@outlook.com
   - Conta Mackenzie: seuemail@mackenzie.br
   - Conta Mackenzista: seuemail@mackenzista.com.br

## ⚠️ Troubleshooting

### Erro 401 Unauthorized
- Verifique se o `AZURE_CLIENT_SECRET` no `.env` está correto
- Verifique se o secret não expirou no Azure Portal
- Confirme que o Redirect URI está exatamente como configurado

### Erro "domain_not_allowed"
O sistema só aceita os seguintes domínios de email:
- `@mackenzie.br`
- `@mackenzista.com.br`
- `@outlook.com`

Para adicionar mais domínios, edite `application-dev.yaml`:
```yaml
metis:
  auth:
    allowed-email-domains:
      - mackenzie.br
      - mackenzista.com.br
      - outlook.com
      - seunovo.dominio.com  # Adicione aqui
```

## 📝 Variáveis de Ambiente

Certifique-se de que os arquivos `.env` estão configurados:

**`.env` (raiz do projeto):**
```bash
AZURE_CLIENT_ID=seu-client-id-aqui
AZURE_CLIENT_SECRET=seu-client-secret-aqui
AZURE_TENANT_ID=seu-tenant-id-aqui  # NÃO usado com 'common'
JWT_SECRET=sua-chave-secreta-aqui
FRONTEND_CALLBACK_URL=http://localhost:3000/auth/callback
```

**`backend/.env`:**
```bash
AZURE_CLIENT_ID=seu-client-id-aqui
AZURE_CLIENT_SECRET=seu-client-secret-aqui
AZURE_TENANT_ID=seu-tenant-id-aqui  # NÃO usado com 'common'
JWT_SECRET=sua-chave-secreta-aqui
```

**`.env.local` (raiz do projeto - para Next.js):**
```bash
FRONTEND_CALLBACK_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🎉 Pronto!

Agora o sistema aceita contas Microsoft pessoais E organizacionais!
