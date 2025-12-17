package com.Reddit.reddit_clone.services.implementations;

import com.Reddit.reddit_clone.model.dtos.CommentDtos.CommentReqDto;
import com.Reddit.reddit_clone.model.dtos.CommentDtos.CommentResDto;
import com.Reddit.reddit_clone.model.entities.Comment;
import com.Reddit.reddit_clone.model.entities.Post;
import com.Reddit.reddit_clone.model.entities.User;
import com.Reddit.reddit_clone.model.mappers.CommentMapper;
import com.Reddit.reddit_clone.repos.CommentRepo;
import com.Reddit.reddit_clone.repos.PostRepo;
import com.Reddit.reddit_clone.repos.UserRepo;
import com.Reddit.reddit_clone.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private PostRepo postRepo;
    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private CommentRepo commentRepo;

    @Override
    public CommentResDto addComment(CommentReqDto dto, Integer userId) {
        Optional<Post>post=postRepo.findById(dto.getPostId());
        Optional<User>user=userRepo.findById(userId);
        if(post.isPresent()&&user.isPresent()){
            Comment comment=commentMapper.toEntity(dto);
            post.get().getComments().add(comment);
            user.get().getComments().add(comment);
            comment.setPost(post.get());
            comment.setUser(user.get());
            commentRepo.save(comment);
            postRepo.save(post.get());
            userRepo.save(user.get());

            return commentMapper.toResponse(comment);

        }
        else {
            System.out.println("you may entered some thing wrong !!!!!");
            return null ;
        }
    }

    @Override
    public CommentResDto updateComment(CommentReqDto dto) {

        return null;
    }

    @Override
    public List<CommentResDto> getPostComments(Integer postId) {
        Optional<List<Comment>>comments=commentRepo.findByPost_PostId(postId);
        if(comments.isPresent()){
            return commentMapper.toResponses(comments.get());
        }
        else{
            System.out.println("The post is not here or may be deleted !!!!!");
            return null;
        }
    }

    @Override
    public void upVote(Integer commentId) {
        Optional<Comment>comment=commentRepo.findById(commentId);
        if(comment.isPresent()){
            comment.get().setVotes(comment.get().getVotes()+1);
            commentRepo.save(comment.get());
        }
        else {
            System.out.println("لا و الف لا ");
        }
    }

    @Override
    public void downVote(Integer commentId) {
        Optional<Comment>comment=commentRepo.findById(commentId);
        if(comment.isPresent()){
            comment.get().setVotes(comment.get().getVotes()-1);
            commentRepo.save(comment.get());
        }
        else {
            System.out.println("لا و الف لا ");
        }
    }
}
