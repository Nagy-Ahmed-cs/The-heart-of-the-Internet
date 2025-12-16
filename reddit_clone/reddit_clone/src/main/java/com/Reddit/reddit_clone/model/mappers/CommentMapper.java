package com.Reddit.reddit_clone.model.mappers;

import com.Reddit.reddit_clone.model.dtos.CommentDtos.CommentReqDto;
import com.Reddit.reddit_clone.model.dtos.CommentDtos.CommentResDto;
import com.Reddit.reddit_clone.model.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    List<CommentResDto>toResponses(List<Comment>comments);
    Comment toEntity(CommentReqDto dto);
    
    @Mapping(source="commentId", target="commentId")
    @Mapping(source="user.userId", target="userId")
    @Mapping(source="user.userName", target="username")
    @Mapping(source="post.postId",target = "postId")
    CommentResDto toResponse(Comment comment);

}
