# Modelagem do módulo de "Autenticação e Autorização"

## Fluxo de Autenticação

```mermaid
flowchart LR
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

## Diagramas de Sequência

### AUTH-RF1: Autenticação via E-mail Mackenzista e Senha

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

### AUTH-RF2: Sistema deve permitir Logout

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

### AUTH-RF3: Controle de Acesso Baseado em Roles (Middleware)

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

## Diagrama de Classes

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
