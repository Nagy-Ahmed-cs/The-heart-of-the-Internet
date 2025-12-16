package com.Reddit.reddit_clone.repos;

import com.Reddit.reddit_clone.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User>findByPhoneNumber(String phoneNumber);
    Optional<User>findByEmailAndPassword(String userEmail, String password);
}
