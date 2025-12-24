package com.Reddit.reddit_clone.services.implementations;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiService {



    private final String API_KEY = "AIzaSyCXhXx5j5qsGxHPYwxaO8Tqd1F_eD1oWxc";
    private final String ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + API_KEY;
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
                // Check for error in response
                if (responseBody.containsKey("error")) {
                    Map error = (Map) responseBody.get("error");
                    String errorMsg = error.get("message") != null ? error.get("message").toString() : "Unknown error";
                    return "Gemini API Error: " + errorMsg;
                }
                
                List<Map> candidates = (List<Map>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map contentMap = (Map) candidates.get(0).get("content");
                    if (contentMap != null) {
                        List<Map> parts = (List<Map>) contentMap.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            return (String) parts.get(0).get("text");
                        }
                    }
                }
            }
            return "No valid response from Gemini.";
        } catch (org.springframework.web.client.ResourceAccessException e) {
            // Handle I/O errors (network, SSL, connection issues)
            return "Network error connecting to Gemini API. Please check your internet connection and try again. Details: " + e.getMessage();
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // Handle HTTP client errors (4xx)
            return "Gemini API Client Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (org.springframework.web.client.HttpServerErrorException e) {
            // Handle HTTP server errors (5xx)
            return "Gemini API Server Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (Exception e) {
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}