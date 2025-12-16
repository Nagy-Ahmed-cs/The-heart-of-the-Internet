//package com.Reddit.reddit_clone.Security;
//
//import com.Reddit.reddit_clone.model.entities.User;
//import com.Reddit.reddit_clone.repos.UserRepo;
//
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class CustomUserDetailService implements UserDetailsService {
//
//    private final UserRepo userRepo;
//
//    public CustomUserDetailService(UserRepo userRepo) {
//        this.userRepo = userRepo;
//    }
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//
//        User user = userRepo.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        String password = user.getPassword();
//
//        // No roles for now
//        List<GrantedAuthority> roles = new ArrayList<>();
//
//        return new CustomUserDetails(roles, email, password);
//    }
//
//}
