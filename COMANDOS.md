# ⚡ Comandos Rápidos - Metis LMS

Referência rápida para comandos comuns do projeto.

## 🐳 Docker

```bash
# Iniciar apenas MongoDB e Redis (desenvolvimento)
docker-compose up -d mongo redis

# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (apaga dados!)
docker-compose down -v

# Rebuild e reiniciar
docker-compose up -d --build

# Ver status dos containers
docker-compose ps

# Acessar container
docker exec -it metis-backend bash
docker exec -it metis-mongo mongosh
```

## 🎯 Backend (Spring Boot)

```bash
cd backend

# Compilar
./mvnw clean compile

# Executar
./mvnw spring-boot:run

# Executar testes
./mvnw test

# Executar com profile específico
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Gerar JAR
./mvnw clean package

# Executar JAR
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Limpar e reinstalar dependências
./mvnw clean install
```

## 🌐 Frontend (Next.js)

```bash
cd web

# Instalar dependências
pnpm install

# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Iniciar produção
pnpm start

# Lint
pnpm lint

# Limpar cache Next.js
rm -rf .next

# Reinstalar dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 🗄️ MongoDB

```bash
# Conectar ao MongoDB
docker exec -it metis-mongo mongosh

# Comandos dentro do mongosh:
use metis                           # Selecionar database
show collections                    # Listar collections
db.users.find()                     # Listar todos os usuários
db.users.find().pretty()            # Com formatação
db.users.countDocuments()           # Contar documentos
db.token_blacklist.find()           # Ver tokens invalidados
db.users.deleteMany({})             # Apagar todos os usuários
exit                                # Sair

# Backup
docker exec metis-mongo mongodump --out=/data/backup --db=metis

# Restaurar
docker exec metis-mongo mongorestore /data/backup
```

## 📦 Redis

```bash
# Conectar ao Redis
docker exec -it metis-redis redis-cli

# Comandos dentro do redis-cli:
PING                                # Testar conexão
KEYS *                              # Listar todas as chaves
GET chave                           # Ver valor de uma chave
DEL chave                           # Deletar uma chave
FLUSHALL                            # Limpar tudo (cuidado!)
exit                                # Sair
```

## 🔑 Autenticação

```bash
# Gerar JWT_SECRET
openssl rand -base64 64

# Testar login (curl)
curl http://localhost:8080/api/auth/login

# Testar endpoint protegido
curl -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:8080/api/auth/me

# Fazer logout
curl -X POST \
  -H "Authorization: Bearer SEU_TOKEN" \
  http://localhost:8080/api/auth/logout
```

## 🧪 Testes

```bash
# Backend - todos os testes
cd backend
./mvnw test

# Backend - teste específico
./mvnw test -Dtest=AuthResourceTest

# Backend - com coverage
./mvnw test jacoco:report

# Frontend - todos os testes (quando implementado)
cd web
pnpm test

# Frontend - watch mode
pnpm test:watch
```

## 📊 Logs e Debug

```bash
# Ver logs do Spring Boot
cd backend
tail -f logs/app.log

# Ver logs do Docker
docker-compose logs -f backend
docker-compose logs -f web

# Ver últimas 100 linhas
docker-compose logs --tail=100 backend

# Filtrar logs por erro
docker-compose logs backend | grep ERROR
docker-compose logs backend | grep WARN

# Modo debug Spring Boot
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## 🧹 Limpeza

```bash
# Limpar Docker
docker system prune -a              # Remove tudo que não está em uso
docker volume prune                 # Remove volumes não usados
docker-compose down -v --rmi all    # Remove tudo do projeto

# Limpar Maven
cd backend
./mvnw clean

# Limpar Next.js
cd web
rm -rf .next node_modules

# Limpar dados persistentes
rm -rf .docker/mongodb/*
rm -rf .docker/redis/*
```

## 🌍 Variáveis de Ambiente

```bash
# Copiar exemplos
cp .env.example .env
cp backend/.env.example backend/.env
cp web/.env.local.example web/.env.local

# Editar
nano .env

# Ver variáveis carregadas (backend)
cd backend
./mvnw spring-boot:run | grep "AZURE"
```

## 🚀 Deploy

```bash
# Build Docker images
docker-compose build

# Tag para registry
docker tag metis-backend:latest registry.example.com/metis-backend:v1.0.0
docker tag metis-web:latest registry.example.com/metis-web:v1.0.0

# Push para registry
docker push registry.example.com/metis-backend:v1.0.0
docker push registry.example.com/metis-web:v1.0.0
```

## 📝 Git

```bash
# Status
git status

# Criar branch para feature
git checkout -b feature/nome-da-feature

# Commit
git add .
git commit -m "feat: descrição da feature"

# Push
git push origin feature/nome-da-feature

# Voltar para master e atualizar
git checkout master
git pull origin master
```

## 🔍 Troubleshooting

```bash
# Verificar portas em uso
sudo lsof -i :8080
sudo lsof -i :3000
sudo lsof -i :27017

# Reiniciar tudo
docker-compose restart

# Verificar conectividade
curl http://localhost:8080/actuator/health
curl http://localhost:3000

# Ver uso de recursos
docker stats

# Verificar espaço em disco
df -h
docker system df
```

## 📖 Documentação

```bash
# Abrir Swagger
open http://localhost:8080/swagger-ui.html

# Abrir aplicação
open http://localhost:3000

# Mongo Express (se rodando)
open http://localhost:8081
```

## 🎯 Atalhos Úteis

```bash
# Alias recomendados (adicione ao ~/.bashrc ou ~/.zshrc)
alias dc='docker-compose'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
alias dcps='docker-compose ps'

alias mvnr='./mvnw spring-boot:run'
alias mvnt='./mvnw test'
alias mvnc='./mvnw clean'

alias pnpmd='pnpm dev'
alias pnpmb='pnpm build'
alias pnpms='pnpm start'
```

---

**Dica**: Favoritar essa página para acesso rápido! 🔖
