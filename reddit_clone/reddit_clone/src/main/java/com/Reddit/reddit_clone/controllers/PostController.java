package com.Reddit.reddit_clone.controllers;

import com.Reddit.reddit_clone.model.dtos.postDtos.PostReqDto;
import com.Reddit.reddit_clone.model.dtos.postDtos.PostResDto;
import com.Reddit.reddit_clone.services.PostServices;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PostController {
    @Autowired
    private PostServices postServices;
    @PostMapping("/create-post")
    public ResponseEntity<PostResDto> createPost(@RequestBody PostReqDto dto){
        return ResponseEntity.ok(postServices.createPost(dto));
    }
    @GetMapping("/get-community-posts")
    public ResponseEntity<List<PostResDto>>getCommunityPosts(@RequestParam String communityName){
        return ResponseEntity.ok(postServices.getPostForCommunity(communityName));
    }
    @GetMapping("/get-user-posts")
    public ResponseEntity<List<PostResDto>>getUserPosts(@RequestParam String email){
        return ResponseEntity.ok(postServices.getPostForUser(email));
    }
    @PostMapping("delete-post")
    public ResponseEntity<String> deletePost(Integer postId){
        return ResponseEntity.ok(postServices.deletePost(postId));
    }

    @GetMapping("/get-all-posts")
    public List<PostResDto>getPosts(){
        return postServices.getPosts();
    }
    
    @GetMapping("/get-post")
    public ResponseEntity<PostResDto> getPost(@RequestParam Integer postId){
        PostResDto post = postServices.getPost(postId);
        if(post != null){
            return ResponseEntity.ok(post);
        }
        return ResponseEntity.notFound().build();
    }

}
