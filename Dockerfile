FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw && ./mvnw clean package -DskipTests

EXPOSE 8081

CMD ["java", "-jar", "target/HostelManagementSystem-0.0.1-SNAPSHOT.jar"]