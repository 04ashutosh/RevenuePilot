package com.revenuepilot.revenuepilot_api.domain.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OllamaConfig {
    @Value("${ollama.url:http://localhost:11434}")
    private String url;

    @Value("${ollama.model:llama3}")
    private String model;

    public String getUrl(){
        return url;
    }

    public String getModel(){
        return model;
    }
}
