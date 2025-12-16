package com.Reddit.reddit_clone.repos;

import com.Reddit.reddit_clone.model.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PostRepo extends JpaRepository<Post, Integer> {
    List<Post> findByUser_Email(String  email);
    List<Post>findByCommunity_CommunityName(String communityName);
}
