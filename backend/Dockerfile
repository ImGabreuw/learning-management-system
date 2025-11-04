
FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /workspace

ARG GITHUB_USERNAME
ARG GITHUB_TOKEN

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# Cria o settings.xml dinamicamente usando variáveis de ambiente
RUN mkdir -p /root/.m2 && \
	echo '<settings><servers><server><id>github</id><username>'"${GITHUB_USERNAME}"'</username><password>'"${GITHUB_TOKEN}"'</password></server></servers></settings>' > /root/.m2/settings.xml

RUN chmod +x mvnw && ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENV JAVA_OPTS="-Xms256m -Xmx512m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 /app/app.jar"]
