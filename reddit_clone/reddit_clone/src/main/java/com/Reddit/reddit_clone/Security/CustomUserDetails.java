//package com.Reddit.reddit_clone.Security;
//
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.Collection;
//import java.util.List;
//
//public class CustomUserDetails implements UserDetails {
//    private final String userEmail;
//    private final String password;
//    private final List<GrantedAuthority>roles;
//
//    public CustomUserDetails(List<GrantedAuthority> roles, String userEmail, String password) {
//        this.roles = roles;
//        this.userEmail = userEmail;
//        this.password = password;
//    }
//
//    /**
//     * Returns the authorities granted to the user. Cannot return <code>null</code>.
//     *
//     * @return the authorities, sorted by natural key (never <code>null</code>)
//     */
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        return this.roles;
//    }
//
//    /**
//     * Returns the password used to authenticate the user.
////     *
//     * @return the password
//     */
//    @Override
//    public String getPassword() {
//        return this.password;
//    }
//
//    /**
//     * Returns the username used to authenticate the user. Cannot return
//     * <code>null</code>.
//     *
//     * @return the username (never <code>null</code>)
//     */
//    @Override
//    public String getUsername() {
//        return this.userEmail;
//    }
//
//
//    @Override
//    public boolean isAccountNonExpired() {
//        //return UserDetails.super.isAccountNonExpired();
//        return true;
//    }
//
//
//    @Override
//    public boolean isAccountNonLocked() {
//        //return UserDetails.super.isAccountNonLocked();
//        return true;
//    }
//
//    /**
//     * Indicates whether the user's credentials (password) has expired. Expired
//     * credentials prevent authentication.
//     *
//     * @return <code>true</code> if the user's credentials are valid (ie non-expired),
//     * <code>false</code> if no longer valid (ie expired)
//     */
//    @Override
//    public boolean isCredentialsNonExpired() {
//        //return UserDetails.super.isCredentialsNonExpired();
//        return true;
//    }
//
//    /**
//     * Indicates whether the user is enabled or disabled. A disabled user cannot be
//     * authenticated.
//     *
//     * @return <code>true</code> if the user is enabled, <code>false</code> otherwise
//     */
//    @Override
//    public boolean isEnabled() {
////        return UserDetails.super.isEnabled();
//        return true;
//    }
//}
