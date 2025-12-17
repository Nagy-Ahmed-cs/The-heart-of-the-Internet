package com.Reddit.reddit_clone.model.dtos.postDtos;

import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder

public class PostReqDto {
    private String content;
    private String title;
    private Integer userId;
    private String communityName;
}
