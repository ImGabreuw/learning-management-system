# Modelagem do módulo de "Oportunidades"

## Diagrama de Casos de Uso

![](../casos%20de%20uso/oportunities.png)

A relação entre "Recomendar Oportunidades" e "Gerenciar Perfil" é do tipo "extend", indicando que a recomendação de oportunidades pode depender do gerenciamento do perfil do usuário. De forma mais detalhada, conforme o diagrama de sequência do caso de uso "Recomendar Oportunidades", o sistema verifica o perfil do aluno é válido antes de gerar as recomendações. Se o perfil estiver incompleto ou inválido, o sistema pode solicitar ao aluno que atualize seu perfil para melhorar a precisão das recomendações.

## Diagrama de Sequência

### OPP-RF1: Cadastrar oportunidade

```mermaid
sequenceDiagram
      actor Professor
      participant boundary as OportunidadeBoundary
      participant controller as OportunidadeController
      participant service as OportunidadeService
      participant repo as OportunidadeRepository

      Professor->>+boundary: 1: Preencher Formulário de Cadastro de Oportunidade
      boundary->>+controller: 2: cadastrarOportunidade(dadosOportunidade, professorId)
      controller->>+service: 3: cadastrarOportunidade(dadosOportunidade, professorId)
      
      alt professor autenticado e autorizado
          service->>service: 4: verificarAutenticacao(professorId)
          service->>service: 5: verificarPermissaoProfessor(professorId)
          service->>service: 6: validarDadosOportunidade(dadosOportunidade)
          service->>service: 7: criarOportunidade(dadosOportunidade)
          service->>+repo: 8: salvar(oportunidade)
          repo-->>-service: 9: oportunidadeSalva
          service-->>-controller: 10: respostaSucesso(oportunidade)
          controller-->>-boundary: 11: exibirMensagemSucesso(oportunidade)
          boundary-->>-Professor: 12: (Toast) Oportunidade cadastrada com sucesso!
      else dados inválidos
          service->>service: 4: verificarAutenticacao(professorId)
          service->>service: 5: verificarPermissaoProfessor(professorId)
          service->>service: 6: validarDadosOportunidade(dadosOportunidade)
          service-->>controller: erro: dadosInválidos(mensagemErro)
          controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
          boundary-->>Professor: erro: (Toast) Erro ao cadastrar oportunidade. Verifique os dados e tente novamente.
      else professor não autorizado
          service->>service: 4: verificarAutenticacao(professorId)
          service->>service: 5: verificarPermissaoProfessor(professorId)
          service-->>controller: erro: acessoNegado()
          controller-->>boundary: erro: exibirErroAutorizacao()
          boundary-->>Professor: erro: Redirecionar para página de acesso negado
      end
```

### OPP-RF2: Listagem de oportunidades

```mermaid
sequenceDiagram
      actor Usuario as Professor/Aluno
      participant boundary as OportunidadeBoundary
      participant controller as OportunidadeController
      participant service as OportunidadeService
      participant repo as OportunidadeRepository

      Usuario->>+boundary: 1: Acessar Listagem de Oportunidades
      boundary->>+controller: 2: listarOportunidades(filtros, usuarioId)
      controller->>+service: 3: listarOportunidades(filtros, usuarioId)
      
      alt usuário autenticado e filtros válidos
          service->>service: 4: verificarAutenticacao(usuarioId)
          service->>service: 5: validarFiltros(filtros)
          service->>service: 6: aplicarFiltros(filtros)
          service->>+repo: 7: buscarOportunidades(filtros)
          repo-->>-service: 8: oportunidades[]
          service->>service: 9: formatarResultados(oportunidades)
          service-->>-controller: 10: oportunidadesFormatadas[]
          controller-->>-boundary: 11: exibirListaOportunidades(oportunidades)
          boundary-->>-Usuario: 12: Apresentar lista de oportunidades
      else filtros inválidos
          service->>service: 4: verificarAutenticacao(usuarioId)
          service->>service: 5: validarFiltros(filtros)
          service-->>controller: erro: filtrosInválidos(mensagemErro)
          controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
          boundary-->>Usuario: erro: (Toast) Erro nos filtros. Verifique e tente novamente.
      else usuário não autenticado
          service->>service: 4: verificarAutenticacao(usuarioId)
          service-->>controller: erro: usuarioNaoAutenticado()
          controller-->>boundary: erro: exibirErroAutenticacao()
          boundary-->>Usuario: erro: Redirecionar para página de login
      end
```

### OPP-RF3: Recomendar oportunidade

```mermaid
sequenceDiagram
   actor Aluno
   participant boundary as RecomendadorBoundary
   participant controller as RecomendadorController
   participant service as RecomendadorService
   participant library as RecomendadorLibrary
   participant perfilRepo as PerfilRepository

   Aluno->>+boundary: 1: Acessar Feed de Oportunidades Recomendadas
   boundary->>+controller: 2: recomendarOportunidade(alunoId)
   controller->>+service: 3: recomendarOportunidade(alunoId)
   
   alt aluno autenticado e autorizado
       service->>service: 4: verificarAutenticacao(alunoId)
       service->>service: 5: verificarPermissaoAluno(alunoId)
       
       par buscar perfil do aluno
           service->>+perfilRepo: 6a: buscarPerfilAluno(alunoId)
           perfilRepo-->>-service: 7a: perfilAluno
       and processar recomendações
           service->>service: 6b: analisarHistoricoAluno(alunoId)
           service->>+library: 7b: buscarOportunidadesRecomendadas(alunoId, perfil)
           library->>library: 8: calcularCompatibilidade(perfil, oportunidades)
           library-->>-service: 9: oportunidadesRecomendadas[]
       end
       
       service->>service: 10: ranquearRecomendacoes(oportunidades)
       service->>service: 11: formatarRecomendacoes(recomendacoes)
       service-->>-controller: 12: recomendacoesFormatadas[]
       controller-->>-boundary: 13: exibirFeedOportunidadesRecomendadas(recomendacoes)
       boundary-->>-Aluno: 14: Apresentar feed de oportunidades recomendadas
       
   else perfil do aluno inválido
       service->>service: 4: verificarAutenticacao(alunoId)
       service->>service: 5: verificarPermissaoAluno(alunoId)
       service->>perfilRepo: 6: buscarPerfilAluno(alunoId)
       perfilRepo-->>service: 7: perfilNaoEncontrado
       service-->>controller: erro: perfilInvalido(mensagemErro)
       controller-->>boundary: erro: exibirErroValidacao(mensagemErro)
       boundary-->>Aluno: erro: Redirecionar para página de editar perfil
       
   else aluno não autorizado
       service->>service: 4: verificarAutenticacao(alunoId)
       service->>service: 5: verificarPermissaoAluno(alunoId)
       service-->>controller: erro: acessoNegado()
       controller-->>boundary: erro: exibirErroAutorizacao()
       boundary-->>Aluno: erro: Redirecionar para página de acesso negado
   end
```

## Diagrama de Classes

```mermaid
classDiagram
    direction TB

    class Opportunity {
        +String title
        +String description
        +String companyName
        +List~String~ recommendationReasons
        +LocalDate deadline
        +BigDecimal minSalary
        +BigDecimal maxSalary
        +Integer durationInMonths
        +Integer matchPercentage
        +OpportunityType type
        +DifficultyLevel difficulty
        +WorkModality workModality
    }

    class Skill {
        +String name
    }

    class Theme {
        +String name
    }

    class Location {
        +String city
        +String state
    }

    class OpportunityType {
        <<enumeration>>
        INTERNSHIP
        JOB
        HACKATHON
        COURSE
        SCHOLARSHIP
        COMPETITION
    }

    class DifficultyLevel {
        <<enumeration>>
        BEGINNER
        INTERMEDIATE
        ADVANCED
    }

    class WorkModality {
        <<enumeration>>
        ON_SITE
        REMOTE
    }

    Opportunity "*" -- "0..1" Location : is located at
    Opportunity "*" -- "*" Skill : requires
    Opportunity "*" -- "*" Theme : has theme
    Opportunity ..> OpportunityType : uses
    Opportunity ..> DifficultyLevel : uses
    Opportunity ..> WorkModality : uses
```

Se a oportunidade for do tipo "INTERNSHIP" ou "JOB", os atributos `minSalary`, `maxSalary`, `durationInMonths` e `workModality` devem ser obrigatoriamente preenchidos. Se a oportunidade for do tipo "COURSE", "HACKATHON", "SCHOLARSHIP" ou "COMPETITION", esses atributos podem ser nulos.

Se a modalidade de trabalho for "ON_SITE", o atributo `location` deve ser obrigatoriamente preenchido. Se a modalidade for "REMOTE", o atributo `location` pode ser nulo.