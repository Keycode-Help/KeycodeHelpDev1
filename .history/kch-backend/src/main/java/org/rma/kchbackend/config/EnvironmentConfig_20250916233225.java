package org.rma.kchbackend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import java.io.File;

@Configuration
public class EnvironmentConfig {

    @Bean
    @Profile("!prod")
    public Dotenv dotenv() {
        // Try multiple locations for the .env file
        String[] possiblePaths = {
            "./",           // Current directory
            "../",          // Parent directory
            "/app/",        // Container path
            System.getProperty("user.dir") + "/",  // Working directory
            System.getProperty("user.dir") + "/../"  // Parent of working directory
        };
        
        for (String path : possiblePaths) {
            File envFile = new File(path + ".env");
            if (envFile.exists()) {
                System.out.println("🔧 Found .env file at: " + envFile.getAbsolutePath());
                return Dotenv.configure()
                        .directory(path)
                        .filename(".env")
                        .load();
            }
        }
        
        // If no .env file found, create an empty Dotenv instance
        System.out.println("⚠️  No .env file found in any of the expected locations. Using system environment variables only.");
        return Dotenv.configure()
                .ignoreIfMissing()
                .load();
    }

    @Bean
    @Profile("prod")
    public Dotenv dotenvProduction() {
        // Try multiple locations for the .env.production file
        String[] possiblePaths = {
            "./",           // Current directory
            "../",          // Parent directory
            "/app/",        // Container path
            System.getProperty("user.dir") + "/",  // Working directory
            System.getProperty("user.dir") + "/../"  // Parent of working directory
        };
        
        for (String path : possiblePaths) {
            File envFile = new File(path + ".env.production");
            if (envFile.exists()) {
                System.out.println("🔧 Found .env.production file at: " + envFile.getAbsolutePath());
                return Dotenv.configure()
                        .directory(path)
                        .filename(".env.production")
                        .load();
            }
        }
        
        // If no .env.production file found, try regular .env file
        for (String path : possiblePaths) {
            File envFile = new File(path + ".env");
            if (envFile.exists()) {
                System.out.println("🔧 Using .env file for production at: " + envFile.getAbsolutePath());
                return Dotenv.configure()
                        .directory(path)
                        .filename(".env")
                        .load();
            }
        }
        
        // If no env file found, create an empty Dotenv instance
        System.out.println("⚠️  No .env file found in any of the expected locations. Using system environment variables only.");
        return Dotenv.configure()
                .ignoreIfMissing()
                .load();
    }
}
