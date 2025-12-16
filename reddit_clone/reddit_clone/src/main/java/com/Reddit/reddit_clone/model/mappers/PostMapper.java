package com.Reddit.reddit_clone.model.mappers;

import com.Reddit.reddit_clone.model.dtos.postDtos.PostReqDto;
import com.Reddit.reddit_clone.model.dtos.postDtos.PostResDto;
import com.Reddit.reddit_clone.model.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {

    Post toEntity(PostReqDto post);
    
    @Mapping(source = "postId", target = "postId")
    @Mapping(source = "user.userName", target = "username")
    @Mapping(source = "user.email", target = "userEmail")
    @Mapping(source = "community.communityName", target = "communityName")
    PostResDto toResponse(Post post);

    List<PostResDto> toResponses(List<Post> posts);
}
