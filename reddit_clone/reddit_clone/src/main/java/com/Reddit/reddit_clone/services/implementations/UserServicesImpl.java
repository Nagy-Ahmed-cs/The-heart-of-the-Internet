package com.Reddit.reddit_clone.services.implementations;

import com.Reddit.reddit_clone.model.dtos.UserDtos.UserReqDto;
import com.Reddit.reddit_clone.model.dtos.UserDtos.UserResDto;
import com.Reddit.reddit_clone.model.dtos.UserDtos.UserUpdateDto;
import com.Reddit.reddit_clone.model.entities.User;
import com.Reddit.reddit_clone.model.mappers.UserMapper;
import com.Reddit.reddit_clone.repos.UserRepo;
import com.Reddit.reddit_clone.services.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;


@Service

public class UserServicesImpl implements UserServices
{
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private UserMapper userMapper;
    @Override
    public UserResDto createAccount(UserReqDto dto, MultipartFile image) throws IOException {
        User user=userMapper.toEntity(dto);
        user.setImageName(image.getOriginalFilename());
        user.setImageType(image.getContentType());
        user.setImage(image.getBytes());
        return userMapper.toResponse(Optional.of(userRepo.save(user)));
    }

    @Override
    public UserResDto logIn(String userEmail, String password) {

        if (userEmail == null || password == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email and password are required"
            );
        }

        String email = userEmail.trim();
        String pass = password.trim();

        User user = userRepo.findByEmailAndPassword(email, pass)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        return userMapper.toResponse(Optional.ofNullable(user));
    }




    @Override
    public UserResDto updateProfile(UserUpdateDto dto, MultipartFile image) throws IOException {
        Optional<User> user=userRepo.findById(dto.getUserId());
        if(user.isPresent()){
            user.get().setUpdateAt(LocalDateTime.now());
            user.get().setUserName(dto.getUserName());
            // Only update password if provided
            if(dto.getPassword() != null && !dto.getPassword().trim().isEmpty()){
                user.get().setPassword(dto.getPassword());
            }
            // Update phone number if provided
            if(dto.getPhoneNumber() != null){
                user.get().setPhoneNumber(dto.getPhoneNumber().trim().isEmpty() ? null : dto.getPhoneNumber().trim());
            }
            user.get().setImageName(image.getOriginalFilename());
            user.get().setImageType(image.getContentType());
            user.get().setImage(image.getBytes());
            return userMapper.toResponse(Optional.of(userRepo.save(user.get())));

        }
        else {
            return null;
        }
    }

    @Override
    public String deleteAccount(String userEmail) {
        Optional<User>user=userRepo.findByEmail(userEmail);
        if(user.isPresent()){
            user.get().setDeleteAt(LocalDateTime.now());
            userRepo.save(user.get());
            return "Account delete successfully from the website ....\n";
        }
        return "The user is not here already ....\n";
    }
}
