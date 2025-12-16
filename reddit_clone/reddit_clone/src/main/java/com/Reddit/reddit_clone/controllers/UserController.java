package com.Reddit.reddit_clone.controllers;

import com.Reddit.reddit_clone.model.dtos.UserDtos.UserReqDto;
import com.Reddit.reddit_clone.model.dtos.UserDtos.UserResDto;
import com.Reddit.reddit_clone.model.dtos.UserDtos.UserUpdateDto;
import com.Reddit.reddit_clone.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class UserController {
    @Autowired
    private UserServices userServices;
    
    @PostMapping("/create-account")
    public ResponseEntity<UserResDto>createAccount(
            @RequestPart UserReqDto dto, @RequestPart MultipartFile image) throws IOException {
        return ResponseEntity.ok(userServices.createAccount(dto, image));
    }
    
    @GetMapping("/test_login")
    public UserResDto logIn(@RequestParam String userEmail, @RequestParam String password){
       return userServices.logIn(userEmail, password);
    }
    
    @PostMapping("/update-profile")
    public ResponseEntity<UserResDto>updateUser(@RequestPart UserUpdateDto dto, @RequestPart MultipartFile image) throws IOException {
        return ResponseEntity.ok(userServices.updateProfile(dto, image));
    }
    
    @PostMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(@RequestParam String userEmail){
        return ResponseEntity.ok(userServices.deleteAccount(userEmail));
    }
}
