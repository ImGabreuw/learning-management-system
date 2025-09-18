# learning-management-system

## Capítulo 1: Introdução

O projeto visa não apenas modernizar a experiência de usuário através de um design consistente e responsivo, mas também expandir o papel do LMS, transformando-o de um repositório de conteúdo em um ecossistema integrado que promove o desenvolvimento do aluno.

Para isso, propõe-se a implementação de funcionalidades de melhoria, como uma ferramenta de busca inteligente, e inovações como um sistema de recomendação de oportunidades acadêmicas e extracurriculares.

## Capítulo 2: Detalhamento do Projeto

### 2.1. Motivação

A motivação central deste projeto nasce da experiência diária como estudante universitário e da observação das dificuldades operacionais causadas pelas ferramentas de gestão de aprendizagem atualmente em uso.

A dificuldade em localizar materiais de estudo, a inconsistência na organização de conteúdo entre diferentes disciplinas e a instabilidade da plataforma resultam em interrupções no acesso ao conteúdo de aprendizagem.

Adicionalmente, identifica-se uma lacuna na centralização de informações relevantes para a jornada do aluno, como oportunidades de estágio, projetos de pesquisa e atividades de extensão, que hoje são divulgadas de forma descentralizada e assimétrica.

O objetivo é, portanto, criar uma solução que resolva esses pontos práticos e organize a experiência acadêmica, tornando-a mais fluida, integrada e personalizada.

### 2.2. Cenário Atual

O cenário de Learning Management Systems é dominado por plataformas robustas, mas que frequentemente carregam legados técnicos e de design. A análise a seguir combina a perspectiva do usuário final com tendências de mercado.

#### Perspectiva de Aluno

Como usuário direto do Moodle, os seguintes pontos são recorrentes:

- **Design e Usabilidade**: A interface é percebida como não alinhada aos padrões visuais atuais, com navegação pouco intuitiva. A falta de um padrão na estruturação do conteúdo por parte dos docentes demanda um esforço adicional do aluno para a localização de materiais em cada nova disciplina. A experiência em dispositivos móveis apresenta limitações, o que dificulta o acesso rápido a informações.

- **Desempenho e Confiabilidade**: Episódios de lentidão, indisponibilidade em períodos de alta demanda (como semanas de prova) e falhas no upload ou download de arquivos são reportados com frequência por alunos e professores. Tais ocorrências podem impactar a continuidade das atividades acadêmicas.

#### Análise de Mercado

As observações pessoais são validadas por análises mais amplas do setor de EdTech.

- **Confiabilidade como Fator Crítico**: Relatórios como o da Educause apontam consistentemente que a confiabilidade e a facilidade de uso são os fatores mais importantes para a satisfação de alunos e professores com um LMS ([Educause Horizon Report, 2023](https://library.educause.edu/-/media/files/library/2023/4/2023hrteachinglearning.pdf)). Plataformas mais modernas, nativas em nuvem, como o Canvas, utilizam essa estabilidade como um forte diferencial competitivo.

- **A Tendência de "Consumerização"**: Usuários esperam que o software educacional tenha a mesma qualidade de design e experiência de aplicativos de consumo (e.g., Spotify, Netflix). A expectativa por interfaces limpas, personalizadas e intuitivas é uma tendência de mercado que plataformas mais antigas têm dificuldade em acompanhar ([Beyond Functionality: How Consumerization of Enterprise UX is Revolutionizing Work](https://www.photonxtech.com/blogs/beyond-functionality-how-consumerization-of-enterprise-ux-is-revolutionizing-work)).

- **Ecossistemas Integrados**: A direção do mercado aponta para a criação de plataformas que servem como um "hub" central na vida do estudante, integrando-se a outras ferramentas (agendas, ferramentas de anotação) e oferecendo uma visão holística da jornada acadêmica, algo que sistemas tradicionais raramente oferecem de forma nativa.

### 2.3. Estruturação da Demanda

Com base na análise, a demanda para o novo sistema é estruturada em três esferas de atuação:

1. **Problemas (Fundamentais):** Questões centrais que afetam a usabilidade e a funcionalidade do sistema e que devem ser solucionadas na fundação do novo produto.

   - **Design Defasado e Inconsistente**: A necessidade de uma interface de usuário (UI) moderna, intuitiva e padronizada.
   - **Responsividade Deficiente:** O requisito de que a plataforma seja totalmente funcional em dispositivos móveis (mobile-first).
   - **Indisponibilidade e Instabilidade:** Embora seja um desafio de arquitetura complexo, o projeto deve ser concebido sobre uma arquitetura que priorize a escalabilidade e a confiabilidade.

2. **Melhorias (Incrementais):** Funcionalidades que aprimoram processos existentes, gerando ganhos de eficiência para o usuário.

   - **Ferramenta de Busca Difusa (Fuzzy Search):** Implementação de um sistema de busca avançado que permita encontrar termos dentro do conteúdo de documentos (PDFs, slides), mesmo com pequenas variações ou erros de digitação.
   - **Integração com Ecossistema de Ferramentas:** Capacidade de integrar-se com ferramentas externas populares entre estudantes, como Google Calendar (para sincronizar prazos) e Notion.

3. **Inovações (Diferenciais):** Novas funcionalidades que expandem o propósito do LMS e criam um valor único para o produto.
   - **Sistema de Recomendação de Oportunidades:**
     - **Perfil de Interesses do Aluno:** Área para o aluno cadastrar suas habilidades e interesses através de tags.
     - **Cadastro de Oportunidades:** Formulário para cadastro de oportunidades, também utilizando tags.
     - **Algoritmo de Recomendação (Content-Based):** Implementação inicial do motor que cruza as tags do perfil do aluno com as das oportunidades para gerar um feed personalizado.

### 2.4. Funcionalidades Fora do Escopo do MVP (Próximos Passos)

As seguintes funcionalidades, embora importantes, serão planejadas para fases futuras do projeto:

- **Ferramenta de Busca Difusa (Fuzzy Search):** Sistema de busca avançado para encontrar termos dentro do conteúdo dos documentos.

- **Integração** com APIs de ferramentas externas (Google Calendar, Notion).

## Capítulo 3: Requisitos do Sistema

### 3.1. Requisitos Funcionais

#### Módulo: Gestão de Usuários

| ID      | Requisito Funcional                                                              | Prioridade |
| ------- | -------------------------------------------------------------------------------- | ---------- |
| USU-RF1 | O sistema deve permitir criar, editar e remover usuários                         | Alta       |
| USU-RF2 | O sistema deve permitir listar usuários com paginação e filtros básicos          | Média      |
| USU-RF3 | O sistema deve permitir vincular usuários a disciplinas (roles: aluno/professor) | Média      |

#### Módulo: Autenticação e Autorização

| ID       | Requisito Funcional                                                            | Prioridade |
| -------- | ------------------------------------------------------------------------------ | ---------- |
| AUTH-RF1 | O sistema deve autenticar usuários via e-mail mackenzista e senha              | Alta       |
| AUTH-RF2 | O sistema deve permitir logout                                                 | Alta       |
| AUTH-RF3 | O sistema deve aplicar controle de acesso baseado em roles (middleware na API) | Baixo      |

#### Módulo: Gestão de Disciplinas

| ID       | Requisito Funcional                                           | Prioridade |
| -------- | ------------------------------------------------------------- | ---------- |
| DISC-RF1 | O sistema deve permitir criar, editar e remover disciplinas   | Alta       |
| DISC-RF2 | O sistema deve permitir listar disciplinas com paginação      | Alta       |
| DISC-RF3 | O sistema deve permitir upload/download de documentos         | Média      |
| DISC-RF4 | O sistema deve permitir acessar os detalhes de uma disciplina | Baixo      |

#### Módulo: Armazenamento de Arquivos

| ID       | Requisito Funcional                                             | Prioridade |
| -------- | --------------------------------------------------------------- | ---------- |
| FILE-RF1 | O sistema deve permitir upload de arquivos (PDF, slides, vídeo) | Alta       |
| FILE-RF2 | O sistema deve permitir download de arquivos                    | Média      |
| FILE-RF3 | O sistema deve permitir listar arquivos com metadados           | Baixo      |

#### Módulo: Oportunidades

| ID      | Requisito Funcional                                                               | Prioridade |
| ------- | --------------------------------------------------------------------------------- | ---------- |
| OPP-RF1 | O sistema deve permitir cadastrar oportunidades (estágio, complementar, extensão) | Alta       |
| OPP-RF2 | O sistema deve permitir listar e filtrar oportunidades                            | Alta       |
| OPP-RF4 | O sistema deve suportar um motor de recomendações (content-based filtering)       | Média      |

### 3.2. Requisitos Não Funcionais

| ID       | Categoria                    | Requisito Não Funcional                 | Critério / Métrica                                                                | Prioridade |
| -------- | ---------------------------- | --------------------------------------- | --------------------------------------------------------------------------------- | ---------- |
| SEC-NF2  | Segurança                    | Armazenamento seguro de dados sensíveis | Senhas com hashing seguro e salting (bcrypt ou Argon2)                            | Alta       |
| SEC-NF3  | Segurança                    | Controle de acesso                      | RBAC (Controle de Acesso Baseado em Função) aplicado nas APIs e aplicação web     | Média      |
| PERF-NF1 | Desempenho                   | Latência de API                         | 95% das respostas < 200 ms sob cenário de carga                                   | Alta       |
| PERF-NF2 | Desempenho                   | Upload de arquivos                      | Suportar uploads até 10 MB no MVP                                                 | Média      |
| MON-NF1  | Monitoramento                | Logs                                    | Logs de autenticação/erros com retenção de 30 dias                                | Baixa      |
| USAB-NF1 | Usabilidade e Acessibilidade | Responsividade e compatibilidade        | Mobile-first; suportar navegadores modernos                                       | Alta       |
| USAB-NF2 | Usabilidade e Acessibilidade | Acessibilidade                          | Avaliação heurística e correções críticas; meta: WCAG 2.1 AA em iterações futuras | Baixa      |

### 3.3. Diagramas

#### 3.3.1 Sequência

## Autorização e Autenticação(login)

###### Sequência login

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant AuthManager
    participant UserDetailsService
    participant JwtService
    participant UserRepository

    Client->>AuthController: POST /auth/login (credentials)
    AuthController->>AuthService: authenticate(credentials)
    AuthService->>AuthManager: authenticate(credentials)
    AuthManager->>UserDetailsService: loadUserByUsername(email)
    UserDetailsService->>UserRepository: findByEmail(email)
    UserRepository-->>UserDetailsService: User entity
    UserDetailsService-->>AuthManager: UserDetails
    AuthManager-->>AuthService: Authentication object
    AuthService->>JwtService: generateToken(userDetails)
    JwtService-->>AuthService: JWT token
    AuthService->>JwtService: generateRefreshToken(userDetails)
    JwtService-->>AuthService: Refresh token
    AuthService->>UserRepository: updateLastLogin(userId)
    AuthService-->>AuthController: AuthenticationResponse
    AuthController-->>Client: JWT tokens + user data
```

###### Sequência de validação - Token

```mermaid
sequenceDiagram
    participant Client
    participant JwtAuthFilter
    participant JwtService
    participant UserDetailsService
    participant SecurityContext

    Client->>JwtAuthFilter: Request with JWT token
    JwtAuthFilter->>JwtService: extractUsername(token)
    JwtService-->>JwtAuthFilter: username
    JwtAuthFilter->>UserDetailsService: loadUserByUsername(username)
    UserDetailsService-->>JwtAuthFilter: UserDetails
    JwtAuthFilter->>JwtService: isTokenValid(token, userDetails)
    JwtService-->>JwtAuthFilter: validation result
    JwtAuthFilter->>SecurityContext: setAuthentication()
    JwtAuthFilter-->>Client: Continue request processing
```

###### Entidade do MongoDB

```mermaid
erDiagram
    USER ||--o{ TOKEN : generates
    USER ||--o{ ROLE : has
    ROLE ||--o{ PERMISSION : contains

    USER {
        string id
        string email
        string passwordHash
        array roles
        boolean enabled
        boolean accountNonExpired
        boolean credentialsNonExpired
        boolean accountNonLocked
        timestamp createdAt
        timestamp lastLogin
    }

    TOKEN {
        string id
        string token
        string refreshToken
        timestamp expiration
        timestamp refreshExpiration
        string userId
        boolean revoked
    }

    ROLE {
        string id
        string name
        string description
        array permissions
    }

    PERMISSION {
        string id
        string name
        string description
    }
```

###### Fluxo de Autenticação.

```mermaid
flowchart TD
    Start([Start]) --> ReceiveRequest[Receive Auth Request]
    ReceiveRequest --> ValidateInput{Validate Input}
    ValidateInput -->|Invalid| ReturnError[Return 400 Bad Request]
    ValidateInput -->|Valid| Authenticate[Authenticate User]

    Authenticate --> CheckCredentials{Check Credentials}
    CheckCredentials -->|Invalid| ReturnUnauthorized[Return 401 Unauthorized]
    CheckCredentials -->|Valid| GenerateTokens[Generate JWT Tokens]

    GenerateTokens --> UpdateUser[Update User Last Login]
    UpdateUser --> ReturnTokens[Return Tokens Response]
    ReturnTokens --> End([End])

    ReturnError --> End
    ReturnUnauthorized --> End
```

###### AUTH-RF2 - Logout

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant TokenBlacklistService

    Client->>+AuthController: POST /api/auth/logout <br> Header: "Authorization: Bearer [token]"

    note over AuthController: Extrai o token do Header da requisição.

    AuthController->>+TokenBlacklistService: invalidateToken(token)
    note over TokenBlacklistService: Adiciona o token em uma<br>lista de negação (ex: Cache).
    TokenBlacklistService-->>-AuthController: Confirmação

    AuthController-->>-Client: 200 OK (body: { "message": "Logout bem-sucedido" })

    note right of Client: Cliente deve apagar o<br>token armazenado localmente.
```

## Módulo: Armazenamento de Arquivos
### Diagrama de Sequencia

###### FILE-RF1

```mermaid
sequenceDiagram
    actor Usuario
    participant boundary as ArquivoBoundary
    participant controller as ArquivoController
    participant service as ArquivoService
    participant storage as ArquivoStorage

    Usuario->>boundary: uploadArquivo(arquivo, metadados)
    boundary->>controller: uploadArquivo(arquivo, metadados)
    controller->>controller: validarTipoArquivo(arquivo)
    alt arquivo válido
        controller->>service: armazenarArquivo(arquivo, metadados)
        service->>storage: salvarArquivo(arquivo)
        storage-->>service: confirmacaoUpload
        service-->>controller: respostaSucesso()
        controller-->>boundary: exibirMensagemUpload()
    else arquivo inválido
        controller-->>boundary: exibirErroTipoArquivo()
    end
```
###### FILE-RF2

```mermaid
sequenceDiagram
    actor Usuario
    participant boundary as ArquivoBoundary
    participant controller as ArquivoController
    participant service as ArquivoService
    participant storage as ArquivoStorage

    Usuario->>boundary: downloadArquivo(arquivoId)
    boundary->>controller: downloadArquivo(arquivoId)
    controller->>service: obterArquivo(arquivoId)
    service->>storage: recuperarArquivo(arquivoId)
    alt arquivo existe
        storage-->>service: arquivo
        service-->>controller: arquivo
        controller-->>boundary: iniciarDownload(arquivo)
    else arquivo não encontrado
        storage-->>service: arquivoNaoEncontrado
        service-->>controller: erroArquivoNaoEncontrado()
        controller-->>boundary: exibirErroArquivoNaoEncontrado()
    end
```
###### FILE-RF3

```mermaid
sequenceDiagram
    actor Usuario
    participant boundary as ArquivoBoundary
    participant controller as ArquivoController
    participant service as ArquivoService
    participant repo as ArquivoRepository

    Usuario->>boundary: solicitarListaArquivos(pagina, tamanho)
    boundary->>controller: listarArquivos(pagina, tamanho)
    controller->>service: listarArquivosPaginados(pagina, tamanho)
    service->>repo: buscarPaginado(pagina, tamanho)
    repo-->>service: listaArquivos
    service-->>controller: listaArquivos
    controller-->>boundary: exibirListaArquivos(listaArquivos)
```
### Diagrama de classes

```mermaid
classDiagram
    class ArquivoBoundary {
        +uploadArquivo(arquivo, metadados) void
        +downloadArquivo(arquivoId) void
        +solicitarListaArquivos(pagina, tamanho) void
        +exibirMensagemUpload() void
        +exibirErroTipoArquivo() void
        +iniciarDownload(arquivo) void
        +exibirListaArquivos(lista) void
    }
    
    class ArquivoController {
        +uploadArquivo(arquivo, metadados) ResponseEntity
        +downloadArquivo(arquivoId) ResponseEntity
        +listarArquivos(pagina, tamanho) ResponseEntity
        -validarTipoArquivo(arquivo) boolean
    }
    
    class ArquivoService {
        +armazenarArquivo(arquivo, metadados) Arquivo
        +obterArquivo(arquivoId) Arquivo
        +listarArquivosPaginados(pagina, tamanho) Page~Arquivo~
        -extrairMetadados(arquivo) Map
        -gerarNomeUnico(nomeOriginal) String
    }
    
    class ArquivoRepository {
        +buscarPaginado(pagina, tamanho) Page~Arquivo~
        +buscarPorId(id) Optional~Arquivo~
        +salvar(arquivo) Arquivo
        +deletar(id) void
        +buscarPorTipo(tipo) List~Arquivo~
    }
    
    class ArquivoStorage {
        +salvarArquivo(arquivo) String
        +recuperarArquivo(arquivoId) byte[]
        +deletarArquivo(arquivoId) boolean
        +existeArquivo(arquivoId) boolean
    }
    
    class Arquivo {
        -id: String
        -nomeOriginal: String
        -nomeArmazenado: String
        -caminho: String
        -tamanho: Long
        -tipo: TipoArquivo
        -dataUpload: LocalDateTime
        -checksum: String
        -metadados: Map~String, Object~
        +getId() String
        +getNomeOriginal() String
        +getTamanho() Long
        +getTipo() TipoArquivo
        +getDataUpload() LocalDateTime
        +getMetadados() Map
    }
    
    class TipoArquivo {
        <<enumeration>>
        PDF
        XLSX
        TXT
'       WORD
        +getExtensoes() List~String~
        +isValido(extensao) boolean
        +getMimeTypes() List~String~
    }

    ArquivoBoundary --> ArquivoController : chama
    ArquivoController --> ArquivoService : usa
    ArquivoService --> ArquivoRepository : usa
    ArquivoService --> ArquivoStorage : usa
    ArquivoRepository --> Arquivo : gerencia
    Arquivo --> TipoArquivo : tem
    ArquivoService "1" --> "*" Arquivo : processa
```

### Entidade MongoDb

```mermaid
erDiagram
    ARQUIVO ||--o{ METADADO : contains

    ARQUIVO {
        string id
        string nomeOriginal
        string nomeArmazenado
        string caminho
        long tamanho
        string tipo
        timestamp dataUpload
        string checksum
        string usuarioId
        boolean ativo
    }

    METADADO {
        string arquivoId
        string chave
        string valor
        string tipoDado
    }
```

## Capítulo 5: Modelagem do Sistema

### Casos de Uso: Visão Geral

Aluno:

- Fazer sign-in e sign-up (e-mail mackenzista e senha)
- Acessar disciplinas
- Cadastrar oportunidade (estágio, complementar e extensão)
- Feed de recomendações de oportunidades

(Opcional)

- Busca difusa (fuzzy search) em documentos
- Baixar documentos

Professor:

- Fazer upload de documentos (PDFs, slides, vídeos), com metadados (título, descrição, tags)
- Cadastrar oportunidade (estágio, complementar e extensão)

Administrador:

- Gerenciar usuários (criar, editar, remover)
- Gerenciar disciplinas (criar, editar, remover)
- Vincular professores e alunos às disciplinas

### Módulos

- [Sistema de Recomendação de Oportunidades](./docs/modeling/oportunity-recommendation-system.md)

### Módulo: Gestão de Usuários

#### Casos de Uso:
![Casos de Uso Gestão de Usuários](docs/casos%20de%20uso/usuarios.png)

#### Diagramas de sequência:

###### USU-RF1.1 : Criar usuário
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

###### USU-RF1.2 : Editar usuário
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

###### USU-RF1.3: Remover usuário
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

##### USU-RF2 : Listagem de usuários, com paginação e filtros básicos
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

##### USU-RF3 : Vinculação aluno/professor - Disciplina
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

#### Diagrama de Classes:
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


### Módulo: Gestão de Disciplinas

#### Casos de uso:
![Casos de Uso Disciplina](docs/casos%20de%20uso/disciplinas.png)


#### Diagramas de sequência:

##### DISC-RF1.1 : Criar disciplina

```mermaid
sequenceDiagram
    actor Admin
    participant boundary as DisciplinaBoundary
    participant controller as DisciplinaController
    participant service as DisciplinaService
    participant disciplina as Disciplina

    Admin->>boundary: solicitarCriacaoDisciplina(dadosDisciplina)
    boundary->>controller: criarDisciplina(dadosDisciplina)
    controller->>service: criarDisciplina(dadosDisciplina)
    service->>disciplina: salvar(disciplina)
    disciplina-->>service: disciplinaSalva
    service-->>controller: resposta de sucesso
    controller-->>boundary: exibe mensagem de sucesso
```

##### DISC-RF1.2: Editar disciplina

```mermaid
sequenceDiagram
    actor Admin
    participant boundary as DisciplinaBoundary
    participant controller as DisciplinaController
    participant service as DisciplinaService
    participant disciplina as Disciplina

    Admin->>boundary: solicitarEdicaoDisciplina(id, novosDados)
    boundary->>controller: editarDisciplina(id, novosDados)
    controller->>service: editarDisciplina(id, novosDados)
    service->>disciplina: atualizar(id, novosDados)
    disciplina-->>service: disciplina atualizada
    service-->>controller: resposta de sucesso
    controller-->>boundary: exibe mensagem de sucesso
```

##### DISC-RF1.3: Remover disciplina

```mermaid
sequenceDiagram
    actor Admin
    participant boundary as DisciplinaBoundary
    participant controller as DisciplinaController
    participant service as DisciplinaService
    participant disciplina as Disciplina

    Admin->>boundary: solicitarRemocaoDisciplina(id)
    boundary->>controller: removerDisciplina(id)
    controller->>service: removerDisciplina(id)
    service->>disciplina: deletar(id)
    disciplina-->>service: confirma remocao
    service-->>controller: resposta de sucesso
    controller-->>boundary: exibe mensagem de sucesso

```

##### DISC-RF2: Listagem de disciplinas

```mermaid
sequenceDiagram
    actor Professor/Aluno
    participant boundary as DisciplinaBoundary
    participant controller as DisciplinaController
    participant service as DisciplinaService
    participant disciplina as Disciplina

    Professor/Aluno->>boundary: solicitarListaDisciplinas(idAluno)
    boundary->>controller: listarDisciplinas(idAluno)
    controller->>service: buscarPorAluno(idAluno)
    service->>disciplina: buscarPorAluno(idAluno)
    disciplina-->>service: listaDisciplinas
    service-->>controller: listaDisciplinas
    controller-->>boundary:listaDisciplinasPaginada

```

##### DISC-RF3.1: Upload

```mermaid
sequenceDiagram
    actor Professor
    participant boundary as DocumentoBoundary
    participant controller as DocumentoController
    participant service as DocumentoService
    participant documento as Documento

    Professor->>boundary: uploadDocumento(arquivo, disciplinaId)
    boundary->>controller: uploadDocumento(arquivo, disciplinaId)
    controller->>service: armazenarDocumento(arquivo, disciplinaId)
    service->>documento: salvarArquivo(arquivo, disciplinaId)
    documento-->>service: confirmacao de upload
    service-->>controller: resposta de sucesso
    controller-->>boundary: exibe mensagem de sucesso

```

##### DISC-RF3.2: Download

```mermaid
sequenceDiagram
    actor Professor/Aluno
    participant boundary as DocumentoBoundary
    participant controller as DocumentoController
    participant service as DocumentoService
    participant documento as Documento

    Aluno->>boundary: downloadDocumento(documentoId)
    boundary->>controller: downloadDocumento(documentoId)
    controller->>service: obterDocumento(documentoId)
    service->>documento: recuperarArquivo(documentoId)
    documento-->>service: bytes do arquivo
    service-->>controller: bytes do arquivo
    controller-->>boundary: baixa o arquivo localmente

```

##### DISC-RF4: Listar documentos de uma disciplina

```mermaid
sequenceDiagram
    actor Professor/Aluno
    participant boundary as DisciplinaBoundary
    participant controller as DisciplinaController
    participant service as DisciplinaService
    participant disciplina as Disciplina

    Professor/Aluno->>boundary: solicitarCriacaoDisciplina(dadosDisciplina)
    boundary->>controller: criarDisciplina(dadosDisciplina)
    controller->>service: criarDisciplina(dadosDisciplina)
    service->>disciplina: salvar(disciplina)
    disciplina-->>service: disciplinaSalva
    service-->>controller: resposta de sucesso
    controller-->>boundary: exibe mensagem de sucesso
```

#### Diagrama de classes
```mermaid
classDiagram
    class Pessoa {
        +id: int
        +nome: string
        +email: string
        +fazerLogin(): bool
    }

    class Aluno {
        +listarDisciplinas(): List<Disciplina>
        +downloadDocumento(doc: Documento)
        +acessarConteudos(d: Disciplina)
    }

    class Professor {
        +listarDisciplinas(): List<Disciplina>
        +downloadDocumento(doc: Documento)
        +uploadDocumento(doc: Documento, d: Disciplina)
        +acessarConteudos(d: Disciplina)
    }

    class Admin {
        +criarDisciplina(d: Disciplina)
        +editarDisciplina(d: Disciplina)
        +removerDisciplina(d: Disciplina)
    }

    class Disciplina {
        +id: int
        +nome: string
        +descricao: string
    }

    class Documento {
        +id: int
        +titulo: string
        +tipo: string
        +arquivo: blob
    }

    Pessoa <|-- Aluno
    Pessoa <|-- Professor
    Pessoa <|-- Admin

    Aluno "*" --> "*" Disciplina : "matriculado em"
    Professor "1" --> "*" Disciplina : "leciona"
    Disciplina "1" --> "*" Documento : "contém"

```
