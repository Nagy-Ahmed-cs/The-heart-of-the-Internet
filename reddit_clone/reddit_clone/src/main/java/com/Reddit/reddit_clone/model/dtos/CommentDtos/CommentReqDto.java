package com.Reddit.reddit_clone.model.dtos.CommentDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CommentReqDto {
    private String content;
    private Integer postId;

}
