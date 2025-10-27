# Metis - Backend

API REST para o sistema de gerenciamento de aprendizagem Metis.

## 🚀 Quick Start

### 1. Configurar variáveis de ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar o .env com suas credenciais
# - GITHUB_USERNAME e GITHUB_TOKEN (para dependências privadas)
# - AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID (OAuth2)
# - JWT_SECRET (chave para JWT)
```

### 2. Subir dependências (MongoDB e Redis)

```bash
cd ..
docker compose up -d mongo redis
cd backend
```

### 3. Rodar a aplicação

```bash
# Compilar e rodar em modo dev
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

A aplicação estará disponível em: `http://localhost:8080`

### 4. Testar autenticação OAuth2

Abra no navegador:
```
http://localhost:8080/oauth2/authorization/microsoft
```

📖 **Para guia completo de configuração OAuth2, veja:** [`/docs/OAUTH2_SETUP.md`](../docs/OAUTH2_SETUP.md)

---

## Troubleshooting

### Problema: Dependência `opportunity_recommendation_algorithm` não encontrada

Para resolver o problema de instalação da dependência:

```xml
<dependency>
    <groupId>com.metis</groupId>
    <artifactId>opportunity_recommendation_algorithm</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Solução:** Certifique-se de que você possua o arquivo `~/.m2/settings.xml`:

```xml
<settings>
  <servers>
    <server>
      <id>github</id>
      <username>SEU_GITHUB_USERNAME</username>
      <password>SEU_PERSONAL_ACCESS_TOKEN</password>
    </server>
  </servers>
</settings>
```

**Ou use as variáveis do `.env`** (recomendado):
- O `GITHUB_USERNAME` e `GITHUB_TOKEN` do `.env` serão usados automaticamente

Lembre-se de criar o token de acesso pessoal (Personal Access Token) no GitHub com a permissão de `read:packages`.

### Problema: Erro "Cannot load .env file"

**Solução:** Certifique-se que:
1. O arquivo `.env` existe em `backend/.env`
2. A dependência `spring-dotenv` está no `pom.xml`
3. Rode `./mvnw clean install`