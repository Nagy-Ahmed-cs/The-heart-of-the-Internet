package com.Reddit.reddit_clone.model.dtos.UserDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserUpdateDto {
    private Integer userId;
    private String userName;
    private String password;
    private String phoneNumber;

}
