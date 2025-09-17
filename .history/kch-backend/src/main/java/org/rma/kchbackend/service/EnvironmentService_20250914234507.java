package org.rma.kchbackend.service;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnvironmentService {

    @Autowired
    private Dotenv dotenv;

    public String get(String key) {
        return dotenv.get(key);
    }

    public String get(String key, String defaultValue) {
        return dotenv.get(key, defaultValue);
    }

    public boolean has(String key) {
        return dotenv.get(key) != null;
    }
}
