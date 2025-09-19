# Modelagem do módulo de "Usuários"

## Casos de Uso

![](../assets/usuarios.png)

## Diagramas de Sequência

### USU-RF1.1: Criar usuário

```mermaid
sequenceDiagram
    actor Admin
    participant boundary as UsuarioBoundary
    participant controller as UsuarioController
    participant service as UsuarioService
    participant repository as UsuarioRepository

    Admin->>+boundary: Solicitar criação de usuário
    boundary->>+controller: criarUsuario(dadosUsuario, adminId)
    controller->>+service: criarUsuario(dadosUsuario, adminId)
    
    alt admin autenticado e dados válidos
        service->>service: Validar autenticação e permissões admin
        service->>service: Validar dados do usuário (email, nome, roles)
        service->>service: Verificar se email já existe
        service->>service: Criptografar senha temporária
        service->>+repository: salvar(usuario)
        repository-->>-service: usuarioSalvo
        service-->>-controller: respostaSucesso(usuario)
        controller-->>-boundary: exibirMensagemSucesso(usuario)
        boundary-->>-Admin: (Toast) Usuário criado com sucesso!
    else dados inválidos
        service->>service: Validar dados do usuário
        service-->>controller: erro: dadosInvalidos(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Dados inválidos. Verifique os campos.
    else email já existe
        service->>service: Verificar se email já existe
        service-->>controller: erro: emailJaExiste(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Email já cadastrado no sistema
    else admin não autorizado
        service->>service: Validar autenticação e permissões
        service-->>controller: erro: acessoNegado()
        controller-->>boundary: erro: exibirErroAutorizacao()
        boundary-->>Admin: erro: Redirecionar para página de acesso negado
    end
```

### USU-RF1.2: Editar usuário

```mermaid
sequenceDiagram
    actor Admin
    participant boundary as UsuarioBoundary
    participant controller as UsuarioController
    participant service as UsuarioService
    participant repository as UsuarioRepository

    Admin->>+boundary: Solicitar edição de usuário
    boundary->>+controller: editarUsuario(usuarioId, novosDados, adminId)
    controller->>+service: editarUsuario(usuarioId, novosDados, adminId)
    
    alt admin autenticado e usuário existe
        service->>service: Validar autenticação e permissões admin
        service->>+repository: buscarPorId(usuarioId)
        repository-->>-service: usuario
        service->>service: Validar dados de atualização
        service->>service: Verificar se novo email já existe (se alterado)
        service->>+repository: atualizar(usuario)
        repository-->>-service: usuarioAtualizado
        service->>service: Notificar usuário sobre alterações
        service-->>-controller: respostaSucesso(usuarioAtualizado)
        controller-->>-boundary: exibirMensagemSucesso(usuario)
        boundary-->>-Admin: (Toast) Usuário atualizado com sucesso!
    else usuário não encontrado
        service->>service: Validar autenticação e permissões
        service->>repository: buscarPorId(usuarioId)
        service-->>controller: erro: usuarioNaoEncontrado(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Usuário não encontrado
    else dados inválidos
        service->>service: Validar dados de atualização
        service-->>controller: erro: dadosInvalidos(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Dados inválidos. Verifique os campos.
    else admin não autorizado
        service->>service: Validar autenticação e permissões
        service-->>controller: erro: acessoNegado()
        controller-->>boundary: erro: exibirErroAutorizacao()
        boundary-->>Admin: erro: Redirecionar para página de acesso negado
    end
```

### USU-RF1.3: Remover usuário

```mermaid
sequenceDiagram
    actor Admin
    participant boundary as UsuarioBoundary
    participant controller as UsuarioController
    participant service as UsuarioService
    participant repository as UsuarioRepository

    Admin->>+boundary: Solicitar remoção de usuário
    boundary->>+controller: removerUsuario(usuarioId, adminId)
    controller->>+service: removerUsuario(usuarioId, adminId)
    
    alt admin autenticado e usuário existe
        service->>service: Validar autenticação e permissões admin
        service->>+repository: buscarPorId(usuarioId)
        repository-->>-service: usuario
        service->>service: Verificar se usuário não é admin master
        service->>service: Validar impacto da remoção (disciplinas vinculadas)
        service->>+repository: remover(usuarioId)
        repository-->>-service: usuarioRemovido
        service-->>-controller: respostaSucesso(usuarioId)
        controller-->>-boundary: exibirMensagemSucesso()
        boundary-->>-Admin: (Toast) Usuário removido com sucesso!
    else usuário não encontrado
        service->>service: Validar autenticação e permissões
        service->>repository: buscarPorId(usuarioId)
        service-->>controller: erro: usuarioNaoEncontrado(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Usuário não encontrado
    else tentativa de remover admin master
        service->>service: Verificar se usuário não é admin master
        service-->>controller: erro: operacaoNaoPermitida(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Não é possível remover usuário administrador master
    else admin não autorizado
        service->>service: Validar autenticação e permissões
        service-->>controller: erro: acessoNegado()
        controller-->>boundary: erro: exibirErroAutorizacao()
        boundary-->>Admin: erro: Redirecionar para página de acesso negado
    end
```

### USU-RF2: Listar usuários

```mermaid
sequenceDiagram
    actor Admin
    participant boundary as UsuarioBoundary
    participant controller as UsuarioController
    participant service as UsuarioService
    participant repository as UsuarioRepository

    Admin->>+boundary: Solicitar listagem de usuários
    boundary->>+controller: listarUsuarios(filtros, paginacao, adminId)
    controller->>+service: listarUsuarios(filtros, paginacao, adminId)
    
    alt admin autenticado e parâmetros válidos
        service->>service: Validar autenticação e permissões admin
        service->>service: Validar parâmetros de paginação (página, tamanho)
        service->>service: Validar filtros de busca (nome, email, status)
        service->>+repository: buscarComFiltrosEPaginacao(filtros, paginacao)
        repository-->>-service: paginaUsuarios
        service->>+repository: contarTotalUsuarios(filtros)
        repository-->>-service: totalUsuarios
        service->>service: Sanitizar dados sensíveis para exibição
        service->>service: Construir resposta paginada
        service-->>-controller: respostaSucesso(paginaUsuarios, metadados)
        controller-->>-boundary: exibirListaUsuarios(usuarios, paginacao)
        boundary-->>-Admin: (Tabela) Lista de usuários com paginação
    else parâmetros de paginação inválidos
        service->>service: Validar parâmetros de paginação
        service-->>controller: erro: parametrosInvalidos(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Parâmetros de paginação inválidos
    else filtros inválidos
        service->>service: Validar filtros de busca
        service-->>controller: erro: filtrosInvalidos(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Filtros de busca inválidos
    else admin não autorizado
        service->>service: Validar autenticação e permissões
        service-->>controller: erro: acessoNegado()
        controller-->>boundary: erro: exibirErroAutorizacao()
        boundary-->>Admin: erro: Redirecionar para página de acesso negado
    end
```

### USU-RF3: Vincular usuário à disciplina

```mermaid
sequenceDiagram
    actor Admin
    participant boundary as UsuarioBoundary
    participant controller as UsuarioController
    participant service as UsuarioService
    participant userRepo as UsuarioRepository
    participant disciplineRepo as DisciplinaRepository

    Admin->>+boundary: Solicitar vinculação usuário-disciplina
    boundary->>+controller: vincularUsuarioDisciplina(usuarioId, disciplinaId, adminId)
    controller->>+service: vincularUsuarioDisciplina(usuarioId, disciplinaId, adminId)
    
    alt admin autenticado e dados válidos
        service->>service: Validar autenticação e permissões admin
        service->>+userRepo: buscarPorId(usuarioId)
        userRepo-->>-service: usuario
        service->>+disciplineRepo: buscarPorId(disciplinaId)
        disciplineRepo-->>-service: disciplina
        service->>service: Verificar se usuário não é admin (só professor/estudante)
        service->>service: Verificar se disciplina está ativa
        service->>service: Verificar se vinculação já existe
        service->>service: Verificar limite de usuários na disciplina
        service->>+userRepo: adicionarDisciplina(usuarioId, disciplinaId)
        userRepo-->>-service: vinculacaoSalva
        service->>service: Notificar usuário sobre vinculação
        service-->>-controller: respostaSucesso(vinculacao)
        controller-->>-boundary: exibirMensagemSucesso()
        boundary-->>-Admin: (Toast) Usuário vinculado à disciplina com sucesso!
    else usuário não encontrado
        service->>service: Validar autenticação e permissões
        service->>userRepo: buscarPorId(usuarioId)
        service-->>controller: erro: usuarioNaoEncontrado(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Usuário não encontrado
    else disciplina não encontrada
        service->>userRepo: buscarPorId(usuarioId)
        userRepo-->>service: usuario
        service->>disciplineRepo: buscarPorId(disciplinaId)
        service-->>controller: erro: disciplinaNaoEncontrada(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Disciplina não encontrada
    else vinculação já existe
        service->>service: Verificar se vinculação já existe
        service-->>controller: erro: vinculacaoJaExiste(mensagemErro)
        controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
        boundary-->>Admin: erro: (Toast) Usuário já está vinculado a esta disciplina
    else admin não autorizado
        service->>service: Validar autenticação e permissões
        service-->>controller: erro: acessoNegado()
        controller-->>boundary: erro: exibirErroAutorizacao()
        boundary-->>Admin: erro: Redirecionar para página de acesso negado
    end
```

## Diagrama de Classes

```mermaid
classDiagram
    class Admin {
        -int id
        -string nome
        -string email
        +listarUsuarios()
        +filtrarUsuarios()
        +verDetalhesUsuario(int userId)
    }

    class Usuario {
        -int id
        -string nome
        -string email
        -string roles
    }

    class Pagina {
        -int numeroPagina
        -int tamanhoPagina
        -int totalPaginas
        -int totalItens
        -List<Usuario> usuarios
        +List<Usuario> getProximaPagina()
        +List<Usuario> getPaginaAnterior()
    }

    class Filtro {
        -string termoBusca
        -string tipoFiltro
        -string valorFiltro
        +List<Usuario> aplicar(List<Usuario> usuarios)
    }

    Admin --> Usuario : gerencia
    Admin --> Pagina : interage com
    Admin --> Filtro : usa
    Pagina "1" -- "0..*" Usuario : contém
    Filtro ..> Usuario : filtra
```
