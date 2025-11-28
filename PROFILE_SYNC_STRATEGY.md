# Estratégia de Sincronização Azure AD vs Dados do Usuário

## Problema Identificado

Quando o usuário faz login via Azure AD, o sistema poderia sobrescrever dados personalizados que o usuário editou nas configurações.

## Solução Implementada

### 🔐 Campos Controlados pelo Azure (SEMPRE atualizados no login)

- **`email`**: Identificador único, vem do Azure
- **`microsoftId`**: ID do Microsoft Graph, essencial para OAuth2
- **`lastLoginAt`**: Timestamp do último acesso
- **`enabled`**: Status da conta (geralmente true)

### 👤 Campos Personalizáveis pelo Usuário (NÃO sobrescritos)

#### Comportamento no Login:
1. **Primeiro login**: Preenche com dados do Azure se disponíveis
2. **Logins subsequentes**: **PRESERVA** dados editados pelo usuário

#### Campos Protegidos:
- ✅ **`name`**: Após primeira edição, mantém valor personalizado
- ✅ **`phone`**: Editável apenas pelo usuário
- ✅ **`bio`**: Editável apenas pelo usuário  
- ✅ **`location`**: Editável apenas pelo usuário
- ✅ **`birthDate`**: Editável apenas pelo usuário

## Implementação Técnica

### `UserService.updateExistingUser()`

```java
private UserEntity updateExistingUser(UserEntity user, String name, String microsoftId) {
    // Apenas atualiza o nome se estiver vazio (primeiro login)
    if (user.getName() == null || user.getName().isEmpty()) {
        user.setName(name);
        log.info("Nome inicial definido do Azure: {}", name);
    }
    
    // MicrosoftId sempre atualiza (é identificador do Azure)
    user.setMicrosoftId(microsoftId);
    
    // Sempre atualiza timestamp de último login
    user.setLastLoginAt(LocalDateTime.now());
    user.setUpdatedAt(LocalDateTime.now());
    
    UserEntity saved = userRepository.save(user);
    return saved;
}
```

## Fluxo Completo

### Cenário 1: Primeiro Login
```
1. Usuário faz login com Azure
2. Email: joao@mackenzista.com.br
3. Nome do Azure: "João Silva"
4. Sistema cria usuário:
   - email: joao@mackenzista.com.br
   - name: "João Silva" (do Azure)
   - phone: null
   - bio: null
   - location: null
   - birthDate: null
```

### Cenário 2: Usuário Edita Perfil
```
1. Usuário acessa /settings
2. Edita campos:
   - name: "João Pedro Silva"
   - phone: "+55 11 98765-4321"
   - bio: "Estudante de CC"
   - location: "São Paulo, SP"
   - birthDate: "2000-05-15"
3. Clica em "Salvar Alterações"
4. API PUT /api/users/{email} atualiza MongoDB
```

### Cenário 3: Login Subsequente (PROTEÇÃO)
```
1. Usuário faz login novamente com Azure
2. Nome do Azure: "João Silva" (original)
3. Sistema detecta:
   - user.getName() = "João Pedro Silva" (não vazio!)
   - NÃO sobrescreve com "João Silva"
4. Dados preservados:
   - name: "João Pedro Silva" ✅ mantido
   - phone: "+55 11 98765-4321" ✅ mantido
   - bio: "Estudante de CC" ✅ mantido
   - location: "São Paulo, SP" ✅ mantido
   - birthDate: "2000-05-15" ✅ mantido
5. Apenas atualiza:
   - lastLoginAt: 2025-11-28T10:30:00 ✅
   - microsoftId: "abc123..." ✅
```

## Vantagens

✅ **Dados do Azure no primeiro login** - Experiência suave  
✅ **Preserva personalizações** - Usuário tem controle  
✅ **Seguro** - MicrosoftId sempre sincronizado  
✅ **Auditável** - lastLoginAt rastreia acessos  

## Extensões Futuras

### Opção 1: Flag de Sincronização
Adicionar campo `syncWithAzure: boolean` para usuários que QUEREM sincronização automática.

### Opção 2: Histórico de Mudanças
Criar collection `user_profile_history` para auditar alterações:
```json
{
  "userId": "joao@mackenzista.com.br",
  "field": "name",
  "oldValue": "João Silva",
  "newValue": "João Pedro Silva",
  "changedAt": "2025-11-28T09:15:00",
  "changedBy": "USER" // ou "AZURE_SYNC"
}
```

### Opção 3: Merge Inteligente
Se Azure retornar dados novos (ex: novo telefone corporativo), notificar usuário para decidir se aceita ou não.

## Testes Recomendados

1. ✅ Primeiro login → Nome populado do Azure
2. ✅ Editar perfil → Dados salvos corretamente
3. ✅ Segundo login → Dados personalizados preservados
4. ✅ Logout + Login → Dados ainda preservados
5. ✅ Outro usuário → Isolamento correto

## Referências

- Arquivo: `backend/src/main/java/com/metis/backend/auth/service/UserService.java`
- Método: `updateExistingUser()`
- Endpoint: `PUT /api/users/{userId}`
