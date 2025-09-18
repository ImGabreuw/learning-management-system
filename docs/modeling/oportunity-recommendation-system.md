# Modelagem do módulo de "Sistema de Recomendação de Oportunidades"

## Diagrama de Sequência

### OPP-RF1: Cadastrar oportunidade

```mermaid
sequenceDiagram
      actor Professor/Aluno
      participant boundary as OportunidadeBoundary
      participant controller as OportunidadeController
      participant service as OportunidadeService
      participant repo as OportunidadeRepository

      Professor/Aluno->>boundary: solicitarCadastroOportunidade(dadosOportunidade)
      boundary->>controller: cadastrarOportunidade(dadosOportunidade)
      controller->>service: cadastrarOportunidade(dadosOportunidade)
      service->>repo: salvar(oportunidade)
      repo-->>service: oportunidadeSalva
      service-->>controller: respostaSucesso()
      controller-->>boundary: exibe mensagem de sucesso
      boundary-->>Professor/Aluno: oportunidadeCadastrada()
```

### OPP-RF2: Listagem de oportunidades

```mermaid
sequenceDiagram
      actor Professor/Aluno
      participant boundary as OportunidadeBoundary
      participant controller as OportunidadeController
      participant service as OportunidadeService
      participant repo as OportunidadeRepository

      Professor/Aluno->>boundary: solicitarListagemOportunidades(filtros)
      boundary->>controller: listarOportunidades(filtros)
      controller->>service: listarOportunidades(filtros)
      service->>repo: buscarOportunidades(filtros)
      repo-->>service: oportunidades
      service-->>controller: oportunidades
      controller-->>boundary: exibirListaOportunidades(oportunidades)
      boundary-->>Professor/Aluno: listaOportunidades()
```

### OPP-RF3: Recomendar oportunidade

```mermaid
sequenceDiagram
   actor Aluno

   participant boundary as RecomendadorBoundary
   participant controller as RecomendadorController
   participant service as RecomendadorService
   participant library as RecomendadorLibrary

   Aluno-->boundary: solicitarFeedOportunidadesRecomendadas(alunoId)
   boundary-->>controller: recomendarOportunidade(alunoId)
   controller-->>service: recomendarOportunidade(alunoId)
   service-->library: buscarOportunidadesRecomendadas(alunoId)
   library-->>service: oportunidadesRecomendadas
   service-->>controller: oportunidadesRecomendadas
   controller-->>boundary: exibirFeedOportunidadesRecomendadas(oportunidadesRecomendadas)
   boundary-->>Aluno: feedOportunidadesRecomendadas()
```
