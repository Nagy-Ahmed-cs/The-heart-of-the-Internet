package com.Reddit.reddit_clone.model.dtos.postDtos;

import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostResDto {

    private Integer postId;
    private String title;
    private String content;

    // Flattened user
    private String username;
    private String userEmail;

    // Flattened community
    private String communityName;

    private LocalDateTime createAt;
    private String imageName;
    private String imageType;
    @Lob
    private byte [] image;


}
