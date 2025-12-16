package com.Reddit.reddit_clone.model.dtos.UserDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class UserReqDto {
    private String userName;
    private String email;
    private String password;
    private String phoneNumber;

}
