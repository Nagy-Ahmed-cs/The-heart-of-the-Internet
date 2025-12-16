package com.Reddit.reddit_clone.services;

import com.Reddit.reddit_clone.model.dtos.postDtos.PostReqDto;
import com.Reddit.reddit_clone.model.dtos.postDtos.PostResDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PostServices {

    PostResDto createPost(PostReqDto dto);
    PostResDto getPost(Integer postId);
    List<PostResDto>getPostForCommunity(String communityName);
    List<PostResDto>getPostForUser(String email);
    String deletePost(Integer postId);

    List<PostResDto>getPosts();
}
