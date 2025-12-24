package com.Reddit.reddit_clone.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "communities")
@AllArgsConstructor
@NoArgsConstructor
@Data

@Where(clause = "delete_at is null")
public class Community {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer communityId;
    @Column(unique = true)
    private String communityName ;
    private String communityDesc;
    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;
    private LocalDateTime deleteAt;
    @ManyToOne
    @JoinColumn(name="user_id")
    private User createdBy;


    @ManyToMany(mappedBy = "joinedCommunities")
    private Set<User> members = new HashSet<>();


    @OneToMany(mappedBy = "community")
    private List<Post>posts;
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        if (Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Community other = (Community) o;
        return communityId != null && communityId.equals(other.communityId);
    }

    @Override
    public int hashCode() {
        return (communityId != null) ? communityId.hashCode() : System.identityHashCode(this);
    }

}
