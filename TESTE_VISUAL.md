# 🎯 O Que Você Verá de Novo no Localhost

## 🚀 Como Rodar

### 1. Backend
```bash
cd backend
./mvnw spring-boot:run
```
✅ Deve subir em: `http://localhost:8080`

### 2. Frontend
```bash
cd web
npm run dev
```
✅ Deve subir em: `http://localhost:3000`

---

## 🆕 NOVIDADES VISUAIS - O Que Mudou

### 1️⃣ Barra de Navegação (Topo) - **NOVO**
**Antes:** Só tinha logo e perfil  
**Agora:** Tem 3 links clicáveis

```
┌─────────────────────────────────────────────────────────────┐
│ 🎓 Metis    Dashboard | Disciplinas | Arquivos    🔔 👤    │
│              ↑ NOVOS LINKS AQUI ↑                           │
└─────────────────────────────────────────────────────────────┘
```

**Como testar:**
- Clique em "Arquivos" → vai para `/files` (página nova!)
- Clique em "Dashboard" → volta para `/`
- Clique em "Disciplinas" → vai para `/disciplines`

---

### 2️⃣ Dashboard - Aba "Oportunidades" - **INTEGRADO COM BACKEND**

**URL:** `http://localhost:3000`

**Antes:** Dados estáticos (sempre os mesmos)  
**Agora:** Carrega do backend com loading spinner

**O que você verá:**

#### Estado 1: Loading (2-3 segundos)
```
┌─────────────────────────────────────────────┐
│  🔄 Carregando oportunidades...             │
│  ⚪⚪⚪ (spinner girando)                     │
└─────────────────────────────────────────────┘
```

#### Estado 2: Sucesso (se backend rodando + dados no MongoDB)
```
┌──────────────────────────────────────────────────────────┐
│  💼 Estágio em Desenvolvimento Full-Stack                │
│  🏢 TechCorp Startup                                     │
│  📍 São Paulo, SP                                        │
│  🎯 Intermediário | 💰 R$ 2.000 - R$ 3.000              │
│  🏷️ React • Node.js • TypeScript • PostgreSQL           │
└──────────────────────────────────────────────────────────┘
```

#### Estado 3: Fallback (se backend offline)
```
┌──────────────────────────────────────────────────────────┐
│  ⚠️ Não foi possível carregar recomendações              │
│  Mostrando dados de exemplo                              │
│                                                          │
│  [Cards com dados mock aparecem aqui]                   │
└──────────────────────────────────────────────────────────┘
```

**Como testar:**
1. Clique na aba "Oportunidades"
2. Abra DevTools (F12) → Network
3. Procure: `GET /api/opportunities/recommendations/...`
4. Status 200 = sucesso! ✅
5. Status 404/500 = backend sem dados, mostra mock

---

### 3️⃣ Página de Arquivos - **TOTALMENTE NOVA** ⭐

**URL:** `http://localhost:3000/files`

**Como acessar:**
- Clique em "Arquivos" no menu superior

**O que você verá:**

```
┌────────────────────────────────────────────────────────────┐
│  Arquivos e Materiais                                      │
│  Gerencie seus documentos, apresentações e materiais       │
│                                                            │
│  ┌───────────────────────────────────────────────────┐    │
│  │  [Fazer Upload] [Meus Arquivos] [Compartilhados] │    │
│  └───────────────────────────────────────────────────┘    │
│                                                            │
│  ┌─────────────────────────┐  ┌──────────────────────┐   │
│  │ 📤 Upload de Arquivo    │  │ 💡 Dicas de Upload   │   │
│  │                         │  │                      │   │
│  │ Selecionar arquivo      │  │ 📄 Documentos        │   │
│  │ [Escolher arquivo...]   │  │ 🖼️ Imagens           │   │
│  │                         │  │ 🎥 Vídeos            │   │
│  │ Formatos aceitos:       │  │ 📁 Código            │   │
│  │ .pdf, .doc, .ppt, .zip  │  │                      │   │
│  │                         │  │ 💡 Use nomes         │   │
│  │ [Enviar Arquivo]        │  │    descritivos!      │   │
│  └─────────────────────────┘  └──────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

**Como testar o Upload:**

1. **Selecionar arquivo válido (ex: PDF < 10MB):**
   ```
   ┌─────────────────────────────────────────┐
   │ 📄 relatorio.pdf                        │
   │ 2.3 MB                              [X] │
   │                                         │
   │ ███████████████░░░░░░ 75%               │
   │ Enviando... 75%                         │
   └─────────────────────────────────────────┘
   ```

2. **Upload completo:**
   ```
   ┌─────────────────────────────────────────┐
   │ 📄 relatorio.pdf                     ✅ │
   │ 2.3 MB                                  │
   │                                         │
   │ ████████████████████ 100%               │
   │ ✅ Arquivo enviado com sucesso!         │
   └─────────────────────────────────────────┘
   ```

3. **Erro (arquivo muito grande):**
   ```
   ┌─────────────────────────────────────────┐
   │ ⚠️ Arquivo muito grande.                │
   │    Tamanho máximo: 10MB                 │
   └─────────────────────────────────────────┘
   ```

**Como testar validações:**
- Upload arquivo > 10MB → mensagem de erro
- Upload arquivo .exe → mensagem "Tipo não permitido"
- Upload .pdf válido → barra de progresso + sucesso

---

### 4️⃣ Perfil do Usuário - **INTEGRADO COM BACKEND**

**URL:** `http://localhost:3000/profile`

**Como acessar:**
- Clique no avatar (canto superior direito)
- Clique em "Meu Perfil"

**Antes:** Formulário vazio  
**Agora:** Carrega dados do backend

**O que você verá:**

#### Estado 1: Loading
```
┌─────────────────────────────────────────┐
│  Meu Perfil                             │
│                                         │
│  ⚪ Carregando...                       │
└─────────────────────────────────────────┘
```

#### Estado 2: Dados Carregados
```
┌─────────────────────────────────────────┐
│  Meu Perfil                             │
│                                         │
│  Nome Completo                          │
│  [Lucas Fernando Costa]                 │
│                                         │
│  E-mail                                 │
│  [lucas@mackenzista.com.br]             │
│                                         │
│  Interesses                             │
│  [Desenvolvimento Web, IA, Data Sc...]  │
│                                         │
│  Skills Técnicas                        │
│  [React, Node.js, Python, Java...]      │
│                                         │
│  [Salvar Alterações] ← NOVO!            │
└─────────────────────────────────────────┘
```

#### Estado 3: Salvando
```
┌─────────────────────────────────────────┐
│  [🔄 Salvando...] ← botão desabilitado  │
└─────────────────────────────────────────┘
```

#### Estado 4: Sucesso
```
┌─────────────────────────────────────────┐
│  ✅ Perfil atualizado com sucesso!      │
│                                         │
│  [Salvar Alterações]                    │
└─────────────────────────────────────────┘
```

**Como testar:**
1. Abra o perfil
2. Edite algum campo (ex: adicione um interesse)
3. Clique em "Salvar Alterações"
4. Abra DevTools → Network
5. Procure: `PUT /api/users/...` e `POST /api/opportunities/user-profile`
6. Status 200 = salvou! ✅

---

## 🧪 TESTES COMPLETOS - Checklist

### ✅ Teste 1: Navegação Nova
- [ ] Menu tem "Dashboard", "Disciplinas", "Arquivos"
- [ ] Clicar em "Arquivos" leva para `/files`
- [ ] Menu é responsivo (some em mobile)

### ✅ Teste 2: Oportunidades (Backend Integration)
- [ ] Aba "Oportunidades" mostra loading
- [ ] Após loading, cards aparecem
- [ ] DevTools mostra `GET /api/opportunities/recommendations/...`
- [ ] Se backend offline, mostra dados mock com aviso

### ✅ Teste 3: Upload de Arquivos (Página Nova)
- [ ] Página `/files` existe e carrega
- [ ] Tem 3 tabs: Upload, Meus Arquivos, Compartilhados
- [ ] Selecionar arquivo mostra preview
- [ ] Arquivo > 10MB mostra erro
- [ ] Arquivo .exe mostra erro
- [ ] PDF válido mostra barra de progresso
- [ ] Upload completo mostra ✅ sucesso
- [ ] DevTools mostra `POST /api/files/upload`

### ✅ Teste 4: Perfil (Backend Integration)
- [ ] Perfil carrega dados do backend
- [ ] Campos estão preenchidos
- [ ] Editar e salvar funciona
- [ ] Mostra loading durante salvamento
- [ ] Mostra mensagem de sucesso
- [ ] DevTools mostra `PUT /api/users/...`

### ✅ Teste 5: Console (Sem Erros)
- [ ] F12 → Console sem erros vermelhos
- [ ] Avisos amarelos são ok (podem ter)
- [ ] Network tab mostra APIs com status 200

---

## 🐛 Troubleshooting - Se Algo Não Funcionar

### Problema 1: "Oportunidades não carregam"
**Sintoma:** Fica no loading infinito  
**Causa:** Backend offline ou sem dados  
**Solução:**
```bash
# 1. Verificar se backend está rodando
curl http://localhost:8080/api/health

# 2. Popular dados de teste
# Abra: backend/src/main/resources/http/seed-data.http
# Execute as requisições POST
```

### Problema 2: "Perfil não carrega"
**Sintoma:** Mostra "Carregando..." sempre  
**Causa:** Usuário não existe no banco  
**Solução:**
1. Faça login com Microsoft
2. Backend cria usuário automaticamente no primeiro login
3. Recarregue a página

### Problema 3: "Upload não funciona"
**Sintoma:** Erro ao enviar arquivo  
**Causa:** API de arquivos pode não estar configurada  
**Solução:**
```bash
# Verificar logs do backend
# Procure por erros relacionados a upload
# Verifique permissões de diretório
```

### Problema 4: "Menu 'Arquivos' não aparece"
**Sintoma:** Só vejo Dashboard e Disciplinas  
**Causa:** Cache do navegador  
**Solução:**
1. Ctrl + Shift + R (hard reload)
2. Ou limpe cache do navegador

### Problema 5: "Erro 401 Unauthorized"
**Sintoma:** Todas as APIs retornam 401  
**Causa:** Token expirado  
**Solução:**
1. Faça logout
2. Faça login novamente
3. Token será renovado

---

## 📸 Screenshots Esperados

### Tela 1: Dashboard com Oportunidades
```
Você deve ver:
- ✅ Tab "Oportunidades" clicável
- ✅ Cards com título, empresa, localização
- ✅ Badges coloridos (Intermediário, Estágio, etc)
- ✅ Skills em tags azuis
- ✅ Botão "Ver Detalhes"
```

### Tela 2: Página de Arquivos
```
Você deve ver:
- ✅ Título "Arquivos e Materiais"
- ✅ 3 tabs no topo
- ✅ Card de upload à esquerda
- ✅ Card de dicas à direita
- ✅ Botão "Enviar Arquivo"
```

### Tela 3: DevTools Network
```
Você deve ver:
- ✅ GET recommendations → 200 OK
- ✅ GET users/{id} → 200 OK
- ✅ PUT users/{id} → 200 OK
- ✅ POST files/upload → 200 OK
```

---

## 🎯 Resumo: O Que Mudou Visualmente

| Localização | Antes | Depois |
|------------|-------|--------|
| **Menu Superior** | Logo + Perfil | Logo + **Links** + Perfil |
| **Dashboard/Oportunidades** | Mock estático | **Backend + Loading** |
| **Página /files** | ❌ Não existia | ✅ **Página completa** |
| **Perfil** | Formulário vazio | **Carrega do backend** |
| **Network Requests** | Poucos | **Muitos novos** |

---

## ⚡ Quick Test (2 minutos)

```bash
# 1. Rodar backend
cd backend && ./mvnw spring-boot:run

# 2. Rodar frontend (outro terminal)
cd web && npm run dev

# 3. Abrir navegador
http://localhost:3000

# 4. Fazer login

# 5. Verificar 4 coisas:
✅ Menu tem "Arquivos"
✅ Clicar em "Arquivos" abre página nova
✅ Aba "Oportunidades" mostra loading
✅ Perfil carrega dados

# Se os 4 estão OK = TUDO FUNCIONANDO! 🎉
```

---

**Pronto para testar! 🚀**
