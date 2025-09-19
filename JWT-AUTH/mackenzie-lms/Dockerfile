
FROM openjdk:21-jdk-slim

LABEL maintainer="mackenzie-lms@mackenzie.br"
LABEL version="1.0.0"
LABEL description="Mackenzie LMS - Sistema de Gerenciamento de Aprendizagem"

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root para segurança
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copiar o JAR da aplicação
COPY target/lms-1.0.0.jar app.jar

# Criar diretório de logs
RUN mkdir -p /app/logs && chown -R appuser:appuser /app

# Mudar para usuário não-root
USER appuser

# Expor porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Comando de inicialização
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]