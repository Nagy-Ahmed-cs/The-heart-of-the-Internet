package com.Reddit.reddit_clone.controllers;

import com.Reddit.reddit_clone.model.dtos.CommentDtos.CommentReqDto;
import com.Reddit.reddit_clone.model.dtos.CommentDtos.CommentResDto;
import com.Reddit.reddit_clone.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CommentController {
    @Autowired
    private CommentService commentService;
    @PostMapping("/add-comment")
    public ResponseEntity<CommentResDto>addComment(@RequestBody CommentReqDto dto, @RequestParam Integer userId){
        return ResponseEntity.ok(commentService.addComment(dto, userId));
    }
    @GetMapping("/get-post-comments")
    public List<CommentResDto>getPostComments(@RequestParam Integer postId){
        return commentService.getPostComments(postId);
    }
    @PostMapping("up-vote")
    public void upVote(Integer commentId){
         commentService.upVote(commentId);
    }
    @PostMapping("down-vote")
    public void downVote(Integer commentId){
         commentService.downVote(commentId);
    }
}
