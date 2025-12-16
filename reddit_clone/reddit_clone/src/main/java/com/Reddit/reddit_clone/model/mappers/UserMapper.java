package com.Reddit.reddit_clone.model.mappers;

import com.Reddit.reddit_clone.model.dtos.UserDtos.UserReqDto;
import com.Reddit.reddit_clone.model.dtos.UserDtos.UserResDto;
import com.Reddit.reddit_clone.model.entities.User;
import org.mapstruct.Mapper;

import java.util.Optional;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserReqDto dto);
    
    UserResDto toResponseFromUser(User user);
    
    default UserResDto toResponse(Optional<User> user) {
        return user.map(this::toResponseFromUser).orElse(null);
    }
}
