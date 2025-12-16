package com.Reddit.reddit_clone.repos;

import com.Reddit.reddit_clone.model.entities.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommunityRepo extends JpaRepository<Community, Integer> {
    Optional<Community>findByCommunityName(String communityName);
}
