package com.Reddit.reddit_clone.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="posts")
@AllArgsConstructor
@NoArgsConstructor
@Data

public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;
    private String content;
    private String title;
    @CreationTimestamp
    private LocalDateTime createAt;
    private String imageName;
    private String imageType;
    @Lob
    private byte [] image;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name="community_id")
    private Community community;

    @OneToMany(mappedBy = "post")
    private List<Comment>comments;

}
