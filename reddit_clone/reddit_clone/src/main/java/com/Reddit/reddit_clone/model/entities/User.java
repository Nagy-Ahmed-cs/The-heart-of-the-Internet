package com.Reddit.reddit_clone.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Where(clause = "delete_at is null")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;
    private String userName;
    @Email(message = "Enter a valid mail format !!!!")
    @Column(unique = true)
    private String email;
    @Size(min=3, max = 10,message = "enter password")
    private String password;
    @Column(unique = true)
    private String phoneNumber;
    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;
    private LocalDateTime deleteAt;
    private String imageName;
    private String imageType;
    @Lob
    private byte [] image;

    @OneToMany(mappedBy = "createdBy",cascade = CascadeType.ALL)
    private List<Community>communities=new ArrayList<>();


    @ManyToMany
    @JoinTable(
            name = "community_members",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "community_id")
    )
    private Set<Community> joinedCommunities = new HashSet<>();


    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Post>posts;

    @OneToMany(mappedBy = "user")
    private List<Comment>comments;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        User other = (User) o;
        return userId != null && userId.equals(other.userId);
    }

    @Override
    public int hashCode() {
        return (userId != null) ? userId.hashCode() : System.identityHashCode(this);
    }
}
