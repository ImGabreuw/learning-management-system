# Metis - Backend

## Troubleshooting

Para resolver o problema de instalação da dependência `opportunity_recommendation_algorithm`:

```xml
<dependency>
    <groupId>com.metis</groupId>
    <artifactId>opportunity_recommendation_algorithm</artifactId>
    <version>1.0.0</version>
</dependency>
```

Certifique-se de que você possua o arquivo `~/.m2/settings.xml` com o seguinte conteúdo:

```xml
<settings>
  <servers>
    <server>
      <id>github</id>
      <username>GITHUB_USERNAME</username>
      <password>YOUR_PERSONAL_ACCESS_TOKEN</password>
    </server>
  </servers>
</settings>
```

Lembre-se de criar o token de acesso pessoal (Personal Access Token) no GitHub com a permissão de `read:packages`.