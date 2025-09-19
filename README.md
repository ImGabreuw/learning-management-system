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

## Capítulo 4: Protótipo da Interface

![](docs/assets/dashboard_preview.png)

> Para acessar o protótipo [clique aqui](https://learning-management-system-flame-xi.vercel.app/).

[JUSTIFICATIVA AQUI]

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

- [Oportunidades](./docs/modeling/opportunities.md)

### Módulo: Gestão de Usuários

#### Casos de Uso

![Casos de Uso Gestão de Usuários](docs/assets/usuarios.png)

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

## Módulo: Autenticação e Autorização

###### AUTH-RF1: Autenticação via E-mail Mackenzista e Senha

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant AC as AuthController
    participant AS as AuthService
    participant UR as UserRepository
    participant PE as PasswordEncoder
    participant JWT as JwtTokenProvider
    participant DB as MongoDB

    Note over U,DB: AUTH-RF1: Autenticação via e-mail mackenzista e senha

    U->>F: Acessa página de login
    F->>U: Formulário de login
    U->>F: Preenche email (@mackenzie.br) e senha
    F->>F: Validação client-side do formato do email

    alt Email não termina com @mackenzie.br
        F-->>U: "Email deve ser do domínio @mackenzie.br"
    else Email válido
        F->>AC: POST /api/auth/login {email, password}

        Note over AC: Processo de autenticação
        AC->>AS: authenticate(email, password)
        AS->>UR: findByEmail(email)
        UR->>DB: SELECT * FROM users WHERE email = ?
        DB-->>UR: Documento do usuário

        alt Usuário não encontrado
            UR-->>AS: null
            AS-->>AC: AuthenticationException
            AC-->>F: 401 Unauthorized
            F-->>U: "Email ou senha incorretos"
        else Usuário encontrado
            UR-->>AS: Entidade User
            AS->>PE: matches(password, user.hashedPassword)

            alt Senha incorreta
                PE-->>AS: false
                AS-->>AC: AuthenticationException
                AC-->>F: 401 Unauthorized
                F-->>U: "Email ou senha incorretos"
            else Senha correta
                PE-->>AS: true
                Note over AS: Geração do token JWT
                AS->>JWT: generateAccessToken(user)
                JWT-->>AS: Token JWT
                AS-->>AC: AuthResponse{token, user, expiresIn}
                AC-->>F: 200 OK + AuthResponse
                F->>F: Armazena token no sessionStorage
                F-->>U: Redireciona para dashboard
            end
        end
    end
```

###### AUTH-RF2: Sistema deve permitir Logout

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant AC as AuthController
    participant AS as AuthService
    participant BL as TokenBlacklistService
    participant JWT as JwtTokenProvider
    participant DB as MongoDB

    Note over U,DB: AUTH-RF2: Sistema deve permitir logout

    U->>F: Clica no botão "Sair"
    F->>F: Confirma ação de logout
    U->>F: Confirma logout

    F->>AC: POST /api/auth/logout + Bearer {tokenAtual}

    Note over AC: Extração e validação do token
    AC->>AC: extrairTokenDoHeader()

    alt Token ausente no header
        AC-->>F: 400 Bad Request "Token obrigatório"
        F-->>U: "Erro no logout"
    else Token presente
        AC->>JWT: isTokenValid(token)

        alt Token inválido/expirado
            JWT-->>AC: false
            Note over AC: Logout mesmo com token inválido (boa prática)
            AC->>F: limparSessaoCliente()
            AC-->>F: 200 OK "Logout realizado"
            F->>F: Remove token do sessionStorage
            F->>F: Limpa estado da aplicação
            F-->>U: Redireciona para página inicial
        else Token válido
            JWT-->>AC: true
            AC->>AS: performLogout(token)

            Note over AS: Invalidação do token no servidor
            AS->>JWT: getTokenExpiration(token)
            JWT-->>AS: dataExpiracao

            AS->>BL: adicionarTokenNaBlacklist(token, dataExpiracao)
            BL->>DB: INSERT INTO token_blacklist
            DB-->>BL: Token adicionado à blacklist com sucesso
            BL-->>AS: Token invalidado

            AS-->>AC: Logout concluído
            AC-->>F: 200 OK "Logout realizado com sucesso"

            Note over F: Limpeza completa do cliente
            F->>F: sessionStorage.removeItem('token')
            F->>F: Reseta estado da aplicação
            F->>F: Limpa contexto do usuário
            F-->>U: Redireciona para página de login
        end
    end
```

###### AUTH-RF3: Controle de Acesso Baseado em Roles (Middleware)

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant JF as JwtAuthenticationFilter
    participant JWT as JwtTokenProvider
    participant BL as TokenBlacklistService
    participant UDS as UserDetailsService
    participant C as Controller
    participant DB as MongoDB

    Note over U,DB: AUTH-RF3: Controle de acesso baseado em roles (middleware)

    U->>F: Requisição para endpoint protegido (/api/admin/users)
    F->>JF: HTTP GET /api/admin/users + Authorization: Bearer {token}

    Note over JF: Interceptação pelo filtro de segurança
    JF->>JF: doFilterInternal() - Intercepta requisição
    JF->>JWT: extrairTokenDaRequisicao(request)
    JWT-->>JF: Token JWT

    alt Token ausente
        JF-->>F: 401 Unauthorized "Token de acesso obrigatório"
        F-->>U: "Faça login para continuar"
    else Token presente
        JF->>JWT: validarEstruturaToken(token)

        alt Token mal formado
            JWT-->>JF: false
            JF-->>F: 401 Unauthorized "Formato de token inválido"
            F-->>U: "Token inválido, faça login novamente"
        else Token bem formado
            JF->>BL: isTokenBlacklisted(token)

            alt Token na blacklist
                BL-->>JF: true
                JF-->>F: 401 Unauthorized "Token revogado"
                F-->>U: "Sessão expirada, faça login novamente"
            else Token válido
                BL-->>JF: false
                JF->>JWT: obterNomeUsuarioDoToken(token)
                JWT-->>JF: nomeUsuario (email)

                Note over JF: Carregamento de authorities
                JF->>UDS: loadUserByUsername(nomeUsuario)
                UDS->>DB: SELECT usuario, roles FROM users WHERE email = ?
                DB-->>UDS: Dados do usuário + roles
                UDS-->>JF: UserPrincipal com GrantedAuthorities

                JF->>JF: SecurityContextHolder.setAuthentication()
                JF->>C: Prossegue para o método do controller

                Note over C: Verificação de autorização por annotation
                C->>C: @PreAuthorize("hasRole('ADMIN')") verificação

                alt Usuário não tem role ADMIN
                    C-->>F: 403 Forbidden "Privilégios insuficientes"
                    F-->>U: "Você não tem permissão para acessar este recurso"
                else Usuário tem role ADMIN
                    C->>C: Executa lógica de negócio
                    C->>DB: Realiza operação admin
                    DB-->>C: Resultado da operação
                    C-->>F: 200 OK + dados da resposta
                    F-->>U: Exibe dados da operação admin
                end
            end
        end
    end
```

###### Fluxo de Autenticação

```mermaid
flowchart TD
    Start([Início]) --> ReceberRequisicao[Receber Requisição de Autenticação]
    ReceberRequisicao --> ValidarEntrada{Validar Entrada}
    ValidarEntrada -->|Inválida| RetornarErro[Retornar 400 Bad Request]
    ValidarEntrada -->|Válida| Autenticar[Autenticar Usuário]

    Autenticar --> VerificarCredenciais{Verificar Credenciais}
    VerificarCredenciais -->|Inválidas| RetornarNaoAutorizado[Retornar 401 Unauthorized]
    VerificarCredenciais -->|Válidas| GerarTokens[Gerar Tokens JWT]

    GerarTokens --> AtualizarUsuario[Atualizar Último Login do Usuário]
    AtualizarUsuario --> RetornarTokens[Retornar Resposta com Tokens]
    RetornarTokens --> End([Fim])

    RetornarErro --> End
    RetornarNaoAutorizado --> End
```

###### Diagrama de Classes

```mermaid
classDiagram
    %% AUTH-RF1: Classes para Autenticação
    class AuthController {
        -AuthService authService
        +login(LoginRequest) ResponseEntity~AuthResponse~
    }

    class AuthService {
        -UserRepository userRepository
        -PasswordEncoder passwordEncoder
        -JwtTokenProvider jwtTokenProvider
        +authenticate(LoginRequest) AuthResponse
        +validarEmailMackenzie(String) boolean
        +validarCredenciais(String, String) boolean
    }

    class LoginRequest {
        -String email
        -String password
        +isEmailMackenzieValido() boolean
        +validar() void
    }

    class AuthResponse {
        -String accessToken
        -String tokenType
        -Long expiresIn
        -UserDto user
    }

    class JwtTokenProvider {
        -String jwtSecret
        -int jwtExpirationMs
        +generateToken(UserPrincipal) String
        +obterNomeUsuarioDoToken(String) String
        +validarToken(String) boolean
        +isTokenExpirado(String) boolean
        +obterClaimsDoToken(String) Claims
    }

    %% AUTH-RF3: Classes para Autorização (RBAC)
    class JwtAuthenticationFilter {
        -JwtTokenProvider tokenProvider
        -UserDetailsService userDetailsService
        +doFilterInternal(HttpServletRequest, HttpServletResponse, FilterChain) void
        -obterTokenDaRequisicao(HttpServletRequest) String
        -definirAutenticacao(UserDetails, HttpServletRequest) void
    }

    class UserDetailsServiceImpl {
        -UserRepository userRepository
        +loadUserByUsername(String) UserDetails
        -mapearRolesParaAuthorities(Set~Role~) Collection~GrantedAuthority~
    }

    class UserPrincipal {
        -String id
        -String email
        -String password
        -Collection~GrantedAuthority~ authorities
        +create(User) UserPrincipal
        +getAuthorities() Collection~GrantedAuthority~
        +getUsername() String
        +isEnabled() boolean
    }

    class SecurityConfig {
        -JwtAuthenticationFilter jwtAuthenticationFilter
        +passwordEncoder() PasswordEncoder
        +authenticationManager() AuthenticationManager
        +filterChain(HttpSecurity) SecurityFilterChain
    }

    class TokenBlacklistService {
        -RedisTemplate redisTemplate
        +adicionarTokenNaBlacklist(String, Date) void
        +isTokenNaBlacklist(String) boolean
        +limparTokensExpirados() void
    }

    %% Entidades
    class User {
        -String id
        -String email
        -String password
        -Set~Role~ roles
        -boolean enabled
    }

    class Role {
        -String id
        -String name
        -String description
        +getAuthority() String
    }

    %% Relacionamentos AUTH-RF1
    AuthController --> AuthService : usa
    AuthController --> LoginRequest : recebe
    AuthController --> AuthResponse : retorna
    AuthService --> JwtTokenProvider : usa
    AuthService --> User : valida

    %% Relacionamentos AUTH-RF2
    AuthController --> TokenBlacklistService : usa

    %% Relacionamentos AUTH-RF3
    JwtAuthenticationFilter --> JwtTokenProvider : usa
    JwtAuthenticationFilter --> UserDetailsServiceImpl : usa
    JwtAuthenticationFilter --> TokenBlacklistService : usa
    UserDetailsServiceImpl --> UserPrincipal : cria
    UserPrincipal --> User : encapsula
    SecurityConfig --> JwtAuthenticationFilter : configura
    User --> Role : possui
```

###### Entidades MongoDB

```mermaid
erDiagram
    USER ||--o{ TOKEN : gera
    USER ||--o{ ROLE : possui
    ROLE ||--o{ PERMISSION : contem

    USER {
        string id
        string email "Email @mackenzie.br"
        string passwordHash "Hash da senha"
        array roles "Array de roles"
        boolean enabled "Usuário ativo"
        boolean accountNonExpired "Conta não expirada"
        boolean credentialsNonExpired "Credenciais não expiradas"
        boolean accountNonLocked "Conta não bloqueada"
        timestamp createdAt "Data de criação"
        timestamp lastLogin "Último login"
    }

    TOKEN {
        string id
        string token "Token JWT"
        string refreshToken "Token de refresh"
        timestamp expiration "Data de expiração"
        timestamp refreshExpiration "Expiração do refresh"
        string userId "ID do usuário"
        boolean revoked "Token revogado"
    }

    ROLE {
        string id
        string name "Nome da role (ADMIN, PROFESSOR, ALUNO)"
        string description "Descrição da role"
        array permissions "Array de permissões"
    }

    PERMISSION {
        string id
        string name "Nome da permissão"
        string description "Descrição da permissão"
    }
```

### Módulo: Gestão de Disciplinas

#### Casos de uso:

![Casos de Uso Disciplina](docs/assets/disciplinas.png)

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
