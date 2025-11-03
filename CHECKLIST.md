# ✅ Checklist de Verificação - Sistema de Autenticação Metis

Use este checklist para verificar se tudo está funcionando corretamente.

## 📋 Configuração Inicial

### Azure AD
- [ ] Aplicação criada no Azure Portal
- [ ] Client ID copiado
- [ ] Client Secret gerado e copiado
- [ ] Tenant ID copiado
- [ ] Redirect URI configurado: `http://localhost:8080/login/oauth2/code/microsoft`
- [ ] Permissões adicionadas: openid, profile, email, User.Read
- [ ] Admin consent concedido

### Variáveis de Ambiente
- [ ] Arquivo `.env` criado na raiz
- [ ] `AZURE_CLIENT_ID` configurado
- [ ] `AZURE_CLIENT_SECRET` configurado
- [ ] `AZURE_TENANT_ID` configurado
- [ ] `JWT_SECRET` gerado (base64, 64+ caracteres)
- [ ] `FRONTEND_CALLBACK_URL` configurado
- [ ] Arquivo `backend/.env` criado (opcional)
- [ ] Arquivo `web/.env.local` criado

### Docker
- [ ] Docker instalado e rodando
- [ ] Docker Compose instalado
- [ ] MongoDB iniciado: `docker-compose up -d mongo`
- [ ] Redis iniciado: `docker-compose up -d redis`
- [ ] Containers rodando: `docker-compose ps`

## 🎯 Backend

### Compilação
- [ ] Maven instalado ou usando mvnw
- [ ] Dependências instaladas: `./mvnw clean install`
- [ ] Projeto compila sem erros
- [ ] Sem erros de lint/compilação

### Configuração
- [ ] `application-dev.yaml` configurado
- [ ] MongoDB URI correto
- [ ] Redis configurado
- [ ] Domínios de email permitidos configurados
- [ ] Admin emails configurados (se necessário)

### Execução
- [ ] Backend inicia sem erros: `./mvnw spring-boot:run`
- [ ] Porta 8080 disponível
- [ ] Swagger acessível: http://localhost:8080/swagger-ui.html
- [ ] Logs sem erros críticos

### Endpoints
- [ ] `GET /api/auth/login` retorna URL
- [ ] `GET /oauth2/authorization/microsoft` redireciona
- [ ] MongoDB conectado (verificar logs)
- [ ] Redis conectado (verificar logs)

## 🌐 Frontend

### Instalação
- [ ] Node.js 18+ instalado
- [ ] pnpm instalado
- [ ] Dependências instaladas: `pnpm install`
- [ ] Sem erros de instalação

### Configuração
- [ ] `.env.local` criado
- [ ] `NEXT_PUBLIC_API_URL` configurado
- [ ] Variável aponta para backend correto

### Execução
- [ ] Frontend inicia: `pnpm dev`
- [ ] Porta 3000 disponível
- [ ] Página de login acessível: http://localhost:3000/login
- [ ] Sem erros no console do navegador

## 🔐 Fluxo de Autenticação

### Login
- [ ] Página de login carrega corretamente
- [ ] Botão "Entrar com Microsoft" visível
- [ ] Clique no botão redireciona para Microsoft
- [ ] Login no Microsoft funciona
- [ ] Callback retorna com tokens na URL
- [ ] Tokens salvos no localStorage
- [ ] Usuário redirecionado para página principal
- [ ] Usuário autenticado (verificar contexto)

### Validação de Domínio
- [ ] Email @mackenzie.br aceito
- [ ] Email @mackenzista.com.br aceito
- [ ] Email @outlook.com aceito
- [ ] Email de domínio não permitido rejeitado
- [ ] Mensagem de erro exibida corretamente

### Dados do Usuário
- [ ] Nome do usuário exibido
- [ ] Email correto
- [ ] Roles atribuídas corretamente
- [ ] `ROLE_USER` presente para todos
- [ ] `ROLE_STUDENT` para @mackenzista.com.br
- [ ] `ROLE_ADMIN` para emails configurados

### MongoDB
- [ ] Usuário criado no banco
- [ ] Collection `users` existe
- [ ] Dados do usuário corretos
- [ ] Roles persistidas

### JWT
- [ ] Access token gerado
- [ ] Refresh token gerado
- [ ] Tokens válidos (formato JWT)
- [ ] Claims corretas no token
- [ ] Expiração configurada corretamente

## 🚪 Logout

- [ ] Botão de logout funciona
- [ ] Token adicionado à blacklist
- [ ] Collection `token_blacklist` existe
- [ ] localStorage limpo
- [ ] Contexto de autenticação limpo
- [ ] Redirecionamento para /login
- [ ] Token antigo não funciona mais

## 🛡️ Proteção de Rotas

### Frontend
- [ ] Rotas protegidas redirecionam para login
- [ ] ProtectedRoute funciona
- [ ] Verificação de roles funciona
- [ ] Usuário não autorizado vê erro 403

### Backend
- [ ] Endpoints protegidos requerem token
- [ ] Sem token retorna 401
- [ ] Token inválido retorna 401
- [ ] Token expirado retorna 401
- [ ] Token na blacklist retorna 401
- [ ] `@PreAuthorize` funciona
- [ ] Roles verificadas corretamente

## 🔄 Refresh Token

- [ ] Endpoint `/api/auth/refresh` existe
- [ ] Refresh token aceito
- [ ] Novos tokens gerados
- [ ] Refresh token antigo invalidado
- [ ] Expira após 7 dias

## 🧪 Testes

### Cenários de Sucesso
- [ ] Login com email permitido
- [ ] Acesso a rota protegida autenticado
- [ ] Logout completa
- [ ] Refresh token funciona

### Cenários de Erro
- [ ] Login com email não permitido falha
- [ ] Acesso sem token falha (401)
- [ ] Token expirado falha (401)
- [ ] Token invalidado falha (401)
- [ ] Acesso sem role necessária falha (403)

### Roles
- [ ] Admin acessa endpoints admin
- [ ] Não-admin não acessa endpoints admin
- [ ] Professor acessa endpoints professor
- [ ] Student tem role correta

## 📊 Monitoramento

### Logs Backend
- [ ] Logs de autenticação aparecem
- [ ] Nível DEBUG habilitado
- [ ] Arquivo `logs/app.log` criado
- [ ] Sem erros críticos

### Logs Frontend
- [ ] Console sem erros
- [ ] Network requests com status 200
- [ ] Tokens nos headers de requisição

### Banco de Dados
- [ ] MongoDB aceita conexões
- [ ] Collections criadas automaticamente
- [ ] Índices criados
- [ ] TTL funciona na blacklist

## 🐛 Troubleshooting Comum

- [ ] Porta 8080 não está em uso por outro processo
- [ ] Porta 3000 não está em uso por outro processo
- [ ] MongoDB rodando e acessível
- [ ] Redis rodando e acessível
- [ ] CORS configurado corretamente
- [ ] Redirect URI no Azure exatamente igual
- [ ] JWT_SECRET tem tamanho adequado
- [ ] Variáveis de ambiente carregadas

## 🚀 Pronto para Produção

- [ ] Todos os itens acima verificados
- [ ] Testes manuais completos
- [ ] Documentação revisada
- [ ] `.env` com valores de produção
- [ ] HTTPS configurado
- [ ] MongoDB com autenticação
- [ ] Secrets em secret manager
- [ ] Domínios de produção no Azure
- [ ] CORS de produção configurado
- [ ] Logs de produção configurados
- [ ] Backup configurado

## 📝 Notas

Use este espaço para anotar problemas encontrados ou configurações específicas:

```
Data: ____/____/________
Testado por: _______________________

Observações:
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
```

---

**Última atualização**: Novembro 2025
