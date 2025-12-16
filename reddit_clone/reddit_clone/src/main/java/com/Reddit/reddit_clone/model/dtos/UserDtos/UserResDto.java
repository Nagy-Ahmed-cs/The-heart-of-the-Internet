package com.Reddit.reddit_clone.model.dtos.UserDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResDto {
    private Integer userId;
    private String userName;
    private String email;
    private String phoneNumber;
    private String imageName;
    private String imageType;
    private byte [] image;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
