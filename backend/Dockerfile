FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# run stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# copy jar file
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]