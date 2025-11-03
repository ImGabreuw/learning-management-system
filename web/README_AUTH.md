# Frontend - Metis LMS

## Configuração de Autenticação

Este frontend utiliza autenticação OAuth2 via Microsoft Azure AD integrada com JWT para comunicação com a API.

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto `web/`:

```bash
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Para produção, altere para a URL do seu backend em produção.

## Instalação

```bash
# Instalar dependências
pnpm install

# ou
npm install

# ou
yarn install
```

## Executar em Desenvolvimento

```bash
pnpm dev

# ou
npm run dev

# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## Fluxo de Autenticação

### 1. Login

- Usuário acessa `/login`
- Clica em "Entrar com Microsoft"
- É redirecionado para `{API_URL}/oauth2/authorization/microsoft`
- Backend redireciona para Microsoft Azure AD
- Usuário faz login no Microsoft
- Microsoft retorna para o backend
- Backend processa autenticação, cria/atualiza usuário, gera JWT
- Backend redireciona para `/auth/callback?accessToken=...&refreshToken=...`

### 2. Callback

- Frontend captura tokens da URL
- Salva tokens no `localStorage`
- Busca informações do usuário via `/api/auth/me`
- Redireciona para a página principal (`/`)

### 3. Proteção de Rotas

Use o componente `ProtectedRoute` para proteger páginas:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MinhasPagina() {
  return (
    <ProtectedRoute>
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  );
}
```

Para proteger com roles específicas:

```tsx
<ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
  <div>Apenas administradores</div>
</ProtectedRoute>
```

### 4. Usando autenticação nos componentes

```tsx
import { useAuth } from '@/context/AuthContext';

export default function MeuComponente() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Faça login</div>;
  }

  return (
    <div>
      <h1>Olá, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <p>Roles: {user?.roles.join(', ')}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### 5. Fazendo requisições autenticadas

```tsx
import { api } from '@/lib/api';

// GET
const data = await api.get('/api/algum-endpoint');

// POST
const result = await api.post('/api/criar', { campo: 'valor' });

// PUT
const updated = await api.put('/api/atualizar/123', { campo: 'novo valor' });

// DELETE
await api.delete('/api/deletar/123');
```

O token JWT é automaticamente anexado nas requisições.

## Estrutura de Arquivos

```
web/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx         # Processa tokens após OAuth2
│   ├── login/
│   │   └── page.tsx             # Página de login
│   ├── layout.tsx               # Layout principal com AuthProvider
│   └── page.tsx                 # Página inicial (protegida)
├── components/
│   ├── ProtectedRoute.tsx       # HOC para proteger rotas
│   └── ui/                      # Componentes UI (shadcn/ui)
├── context/
│   └── AuthContext.tsx          # Contexto de autenticação
├── lib/
│   ├── api.ts                   # Cliente API com JWT
│   └── utils.ts                 # Utilitários
└── .env.local                   # Variáveis de ambiente
```

## Logout

O logout executa as seguintes ações:

1. Chama `/api/auth/logout` no backend (adiciona token à blacklist)
2. Remove tokens do `localStorage`
3. Limpa estado do usuário no contexto
4. Redireciona para `/login`

```tsx
const { logout } = useAuth();

// Em um botão
<button onClick={logout}>Sair</button>
```

## Tratamento de Erros

### Erros de autenticação

Quando um token JWT expira ou é inválido (resposta 401), o usuário é automaticamente deslogado e redirecionado para `/login`.

### Erros do OAuth2

Se o email não for de um domínio permitido ou houver falha na autenticação, o usuário é redirecionado para `/login?error=...&message=...` com uma mensagem de erro.

## Refresh Token

O sistema está preparado para refresh token automático. Quando implementado, tokens expirados serão renovados automaticamente usando o refresh token.

Para implementar, adicione um interceptor em `lib/api.ts`:

```typescript
if (response.status === 401) {
  // Tentar renovar token
  const refreshToken = getRefreshToken();
  const newTokens = await api.post('/api/auth/refresh', { refreshToken });
  setAuthTokens(newTokens.accessToken, newTokens.refreshToken);
  // Tentar requisição novamente
}
```

## Produção

Para build de produção:

```bash
pnpm build
pnpm start
```

Ou use um serviço como Vercel/Netlify que detecta automaticamente projetos Next.js.

### Checklist para Produção

- [ ] Atualizar `NEXT_PUBLIC_API_URL` para URL da API em produção
- [ ] Configurar CORS no backend para aceitar o domínio do frontend
- [ ] Usar HTTPS em produção
- [ ] Configurar redirect URIs no Azure AD para incluir URL de produção
- [ ] Revisar políticas de segurança (CSP, etc.)

## Domínios Permitidos

Os seguintes domínios de email são permitidos (configurados no backend):

- `@mackenzie.br`
- `@mackenzista.com.br`
- `@outlook.com`

Para alterar, edite `application-dev.yaml` no backend.

## Troubleshooting

### "Não foi possível autenticar"

- Verifique se o backend está rodando
- Verifique a variável `NEXT_PUBLIC_API_URL`
- Veja o console do navegador para erros detalhados

### "Email não permitido"

- O email usado não está em um domínio permitido
- Adicione o domínio no backend (`application-dev.yaml`)

### Redirecionamento após login não funciona

- Verifique se `FRONTEND_CALLBACK_URL` no backend aponta para `http://localhost:3000/auth/callback`
- Verifique se a página de callback está carregando corretamente

## Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Lucide Icons** - Ícones

## Suporte

Para problemas relacionados à autenticação, consulte:
- `backend/AUTHENTICATION.md` - Documentação do backend
- Logs do navegador (F12 > Console)
- Logs do backend
