package com.Reddit.reddit_clone.services;

import com.Reddit.reddit_clone.model.dtos.CommentDtos.CommentReqDto;
import com.Reddit.reddit_clone.model.dtos.CommentDtos.CommentResDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CommentService {
    CommentResDto addComment(CommentReqDto dto, Integer userId);
    CommentResDto updateComment(CommentReqDto dto);
    List<CommentResDto>getPostComments(Integer postId);
    void upVote(Integer commentId);
    void downVote(Integer commentId);

}
