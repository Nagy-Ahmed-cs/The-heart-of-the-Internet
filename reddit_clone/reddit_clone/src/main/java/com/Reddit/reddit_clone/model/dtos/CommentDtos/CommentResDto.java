package com.Reddit.reddit_clone.model.dtos.CommentDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentResDto {
    private Integer commentId;
    private String content;
    private Integer postId;
    private Integer userId;
    private String username;
    private LocalDateTime createAt;
    private boolean isEdited;
    private int votes;

}
