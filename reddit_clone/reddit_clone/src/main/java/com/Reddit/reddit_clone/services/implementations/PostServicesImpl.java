package com.Reddit.reddit_clone.services.implementations;

import com.Reddit.reddit_clone.model.dtos.postDtos.PostReqDto;
import com.Reddit.reddit_clone.model.dtos.postDtos.PostResDto;
import com.Reddit.reddit_clone.model.entities.Community;
import com.Reddit.reddit_clone.model.entities.Post;
import com.Reddit.reddit_clone.model.entities.User;
import com.Reddit.reddit_clone.model.mappers.PostMapper;
import com.Reddit.reddit_clone.repos.CommunityRepo;
import com.Reddit.reddit_clone.repos.PostRepo;
import com.Reddit.reddit_clone.repos.UserRepo;
import com.Reddit.reddit_clone.services.PostServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
@Service
public class PostServicesImpl implements PostServices {
    @Autowired
    private PostRepo postRepo;
    @Autowired
    private CommunityRepo communityRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PostMapper postMapper;
    @Override
    public PostResDto createPost(PostReqDto dto, MultipartFile image) throws IOException {
        Post post=postMapper.toEntity(dto);
        Optional<Community> community = communityRepo.findByCommunityName(dto.getCommunityName());
        Optional<User>user=userRepo.findById(dto.getUserId());
        if(user.isPresent()&&community.isPresent()){
            user.get().getPosts().add(post);
            community.get().getPosts().add(post);
            post.setUser(user.get());
            post.setCommunity(community.get());
            post.setImageName(image.getOriginalFilename());
            post.setImageType(image.getContentType());
            post.setImage(image.getBytes());
            userRepo.save(user.get());
            communityRepo.save(community.get());

            return postMapper.toResponse(postRepo.save(post));
        }
        System.out.println("there may be something wrong ");
        return null;
    }

    @Override
    public PostResDto getPost(Integer postId) {
        Optional<Post>post=postRepo.findById(postId);
        return post.map(value -> postMapper.toResponse(value)).orElse(null);

    }

    @Override
    public List<PostResDto> getPostForCommunity(String communityName) {
        List<Post>posts=postRepo.findByCommunity_CommunityName(communityName);
        return postMapper.toResponses(posts);
    }

    @Override
    public List<PostResDto> getPostForUser(String email) {
        List<Post>posts=postRepo.findByUser_Email(email);
        return postMapper.toResponses(posts);
    }

    @Override
    public String deletePost(Integer postId) {
        Optional<Post>post=postRepo.findById(postId);
        if(post.isPresent()){
            postRepo.delete(post.get());
            return "The post is deleted successfully !!!\n";
        }
        else {
            return "The post is not here !!!!!!!!!\n";
        }
    }

    @Override
    public List<PostResDto> getPosts() {
        List<Post>posts=postRepo.findAll();
        return postMapper.toResponses(posts);
    }
}
