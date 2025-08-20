FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean install -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["./mvnw", "spring-boot:run", "-Dspring.profiles.active=supabase"]
