#### Casos de uso:

![Casos de Uso Disciplina](assets/disciplinas.png)

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
