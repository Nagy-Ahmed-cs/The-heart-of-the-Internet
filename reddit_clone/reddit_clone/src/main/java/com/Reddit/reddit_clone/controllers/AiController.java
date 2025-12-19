package com.Reddit.reddit_clone.controllers;

import com.Reddit.reddit_clone.model.entities.Post;
import com.Reddit.reddit_clone.repos.PostRepo;
import com.Reddit.reddit_clone.services.implementations.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class AiController {

    @Autowired
    private PostRepo postRepo;
    private final GeminiService geminiService;

    public AiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarizePost(@RequestParam Integer postId) {
        try {
            Optional<Post> post = postRepo.findById(postId);
            if (post.isPresent()) {
                String postContent = post.get().getContent();
                if (postContent == null || postContent.trim().isEmpty()) {
                    Map<String, String> response = new HashMap<>();
                    response.put("summary", "This post has no content to summarize.");
                    return ResponseEntity.ok(response);
                }
                String summary = geminiService.askGemini(postContent);
                Map<String, String> response = new HashMap<>();
                response.put("summary", summary);
                return ResponseEntity.ok(response);
            }
            Map<String, String> response = new HashMap<>();
            response.put("summary", "Post not found");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/summarize-all-posts")
    public ResponseEntity<Map<String, Object>> summarizeAllPosts() {
        try {
            List<Post> allPosts = postRepo.findAll();
            if (allPosts.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "No posts found in the system.");
                response.put("summaries", List.of());
                return ResponseEntity.ok(response);
            }

            // Combine all post contents
            StringBuilder allContent = new StringBuilder();
            allContent.append("Summarize all the following posts from a Reddit clone platform:\n\n");
            
            for (int i = 0; i < allPosts.size(); i++) {
                Post post = allPosts.get(i);
                if (post.getContent() != null && !post.getContent().trim().isEmpty()) {
                    allContent.append("Post ").append(i + 1).append(": ").append(post.getTitle()).append("\n");
                    allContent.append("Content: ").append(post.getContent()).append("\n\n");
                }
            }

            String combinedSummary = geminiService.askGemini(allContent.toString());
            
            Map<String, Object> response = new HashMap<>();
            response.put("summary", combinedSummary);
            response.put("totalPosts", allPosts.size());
            response.put("message", "Successfully summarized all posts");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
