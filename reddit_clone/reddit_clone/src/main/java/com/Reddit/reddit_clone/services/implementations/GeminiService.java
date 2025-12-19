package com.Reddit.reddit_clone.services.implementations;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiService {



    private final String API_KEY = "AIzaSyBjk87uae8LACuVxjt9bLUFC_GYrFrb1XU";
    private final String ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBjk87uae8LACuVxjt9bLUFC_GYrFrb1XU";
    private final RestTemplate restTemplate = new RestTemplate();

    public String askGemini(String postContent) {

        String promptTemplate = "You are an AI assistant for a Reddit clone. " +
                "Summarize the following post content in a concise and clear way:\n\n%s";

        String fullPrompt = String.format(promptTemplate, postContent);

        // Build JSON request body
        Map<String, Object> part = Map.of("text", fullPrompt);
        Map<String, Object> content = Map.of(
                "role", "user",
                "parts", List.of(part)
        );
        Map<String, Object> body = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    ENDPOINT,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            // Extract first candidate response
            Map responseBody = response.getBody();
            if (responseBody != null) {
                List<Map> candidates = (List<Map>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map contentMap = (Map) candidates.get(0).get("content");
                    List<Map> parts = (List<Map>) contentMap.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return "No valid response from Gemini.";
        } catch (Exception e) {
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}