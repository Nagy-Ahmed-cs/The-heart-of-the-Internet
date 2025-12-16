package com.Reddit.reddit_clone.repos;

import com.Reddit.reddit_clone.model.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Integer> {

    Optional<List<Comment>> findByPost_PostId(Integer postId);
}
