# Modelagem do módulo de "Usuários"

## Casos de Uso

![](docs/assets/usuarios.png)

## Diagramas de Sequência

### USU-RF1.1: Criar usuário

```mermaid
sequenceDiagram
    actor Admin
    participant Boundary as usuarioBoundary
    participant Controller as usuarioController
    participant Service as usuarioService
    participant Repository as usuarioRepository

    Admin->>Boundary: requisicaoCriacaoUsuario()
    activate Boundary
    Boundary->>Controller: solicitarCriarUsuario(email, id, cargos)
    activate Controller
    Controller->>Service: criarUsuario(email, id, cargos)
    activate Service
    Service->>Repository: criarUsuario(email, id, cargos)
    activate Repository
    Repository-->>Service: usuarioCriado()
    deactivate Repository
    Service-->>Controller: usuarioCriado()
    deactivate Service
    Controller-->>Boundary: usuarioCriado()
    deactivate Controller
    Boundary-->>Admin: confirmacaoCriacao()
    deactivate Boundary
```

### USU-RF1.2: Editar usuário

```mermaid
sequenceDiagram
    actor Admin
    participant Boundary as usuarioBoundary
    participant Controller as usuarioController
    participant Service as usuarioService
    participant Repository as usuarioRepository

    Admin->>Boundary: requisicaoEdicaoUsuario(id, novosDados)
    activate Boundary
    Boundary->>Controller: solicitarEdicaoUsuario(id, novosDados)
    activate Controller
    Controller->>Service: editarUsuario(id, novosDados)
    activate Service
    Service->>Repository: atualizarUsuario(id, novosDados)
    activate Repository
    Repository-->>Service: usuarioAtualizado()
    deactivate Repository
    Service-->>Controller: usuarioAtualizado()
    deactivate Service
    Controller-->>Boundary: usuarioAtualizado()
    deactivate Controller
    Boundary-->>Admin: confirmacaoEdicao()
    deactivate Boundary
```

### USU-RF1.3: Remover usuário

```mermaid
sequenceDiagram
    actor Admin
    participant Boundary as usuarioBoundary
    participant Controller as usuarioController
    participant Service as usuarioService
    participant Repository as usuarioRepository

    Admin->>Boundary: requisicaoRemocaoUsuario(id)
    activate Boundary
    Boundary->>Controller: solicitarRemocaoUsuario(id)
    activate Controller
    Controller->>Service: removerUsuario(id)
    activate Service
    Service->>Repository: removerUsuarioPorId(id)
    activate Repository
    Repository-->>Service: usuarioRemovido()
    deactivate Repository
    Service-->>Controller: usuarioRemovido()
    deactivate Service
    Controller-->>Boundary: usuarioRemovido()
    deactivate Controller
    Boundary-->>Admin: confirmacaoRemocao()
    deactivate Boundary

```

### USU-RF2: Listagem de usuários, com paginação e filtros básicos

```mermaid
sequenceDiagram
    Actor User as Usuario
    participant Boundary as usuarioBoundary
    participant Controller as usuarioController
    participant Service as usuarioService
    participant Repository as usuarioRepository

    User->>Boundary: requisicaoListagemUsuarios(filtros, pagina, tamanhoPagina)
    activate Boundary
    Boundary->>Controller: solicitarListagemUsuarios(filtros, pagina, tamanhoPagina)
    activate Controller
    Controller->>Service: listarUsuarios(filtros, pagina, tamanhoPagina)
    activate Service
    Service->>Repository: buscarUsuariosComFiltros(filtros, pagina, tamanhoPagina)
    activate Repository
    Repository-->>Service: listaDeUsuariosPaginada()
    deactivate Repository
    Service-->>Controller: listaDeUsuariosPaginada()
    deactivate Service
    Controller-->>Boundary: listaDeUsuariosPaginada()
    deactivate Controller
    Boundary-->>User: exibirUsuariosPaginados()
    deactivate Boundary
```

### USU-RF3: Vinculação aluno/professor à disciplina

```mermaid
sequenceDiagram
    Actor Admin
    participant Boundary as usuarioBoundary
    participant Controller as usuarioController
    participant Service as usuarioService
    participant Repository as usuarioRepository

    Admin->>Boundary: requisicaoVincularUsuarioDisciplina(idUsuario, idDisciplina, cargo)
    activate Boundary
    Boundary->>Controller: solicitarVinculoUsuarioDisciplina(idUsuario, idDisciplina, cargo)
    activate Controller
    Controller->>Service: vincularUsuarioDisciplina(idUsuario, idDisciplina, cargo)
    activate Service
    Note right of Service: Valida se o cargo é 'aluno' ou 'professor'
    Service->>Repository: salvarVinculo(idUsuario, idDisciplina, cargo)
    activate Repository
    Repository-->>Service: vinculoCriado()
    deactivate Repository
    Service-->>Controller: vinculoCriado()
    deactivate Service
    Controller-->>Boundary: vinculoCriado()
    deactivate Controller
    Boundary-->>Admin: confirmacaoVinculo()
    deactivate Boundary
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
