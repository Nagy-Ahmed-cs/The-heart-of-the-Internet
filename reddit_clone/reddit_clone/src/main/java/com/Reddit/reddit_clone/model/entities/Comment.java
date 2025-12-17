package com.Reddit.reddit_clone.model.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="comments")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer commentId;
    private String content;
    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;
    private boolean isEdited;
    @Column(nullable = false)
    private int votes =0;
    @ManyToOne
    @JoinColumn(name="post_id")
    Post post;
    @ManyToOne
    @JoinColumn(name="user_id")
    User user;
}
