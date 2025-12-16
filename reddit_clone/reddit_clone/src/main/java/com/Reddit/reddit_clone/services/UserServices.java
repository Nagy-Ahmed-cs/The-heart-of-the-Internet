package com.Reddit.reddit_clone.services;

import com.Reddit.reddit_clone.model.dtos.UserDtos.UserReqDto;
import com.Reddit.reddit_clone.model.dtos.UserDtos.UserResDto;
import com.Reddit.reddit_clone.model.dtos.UserDtos.UserUpdateDto;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service

public interface UserServices {
    UserResDto createAccount(UserReqDto dto, MultipartFile image) throws IOException;
    UserResDto logIn (String userEmail, String password);
    UserResDto updateProfile(UserUpdateDto dto, MultipartFile image) throws IOException;
    String deleteAccount(String userEmail);
}
