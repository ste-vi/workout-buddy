package com.stevi.workoutbuddy.security

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(private val userId: Long) : UserDetails {

    fun getUserId(): Long {
        return userId;
    }

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf()
    }

    override fun getPassword(): String {
        return "";
    }

    override fun getUsername(): String {
        return "";
    }

    override fun isAccountNonExpired(): Boolean {
        return true

    }

    override fun isAccountNonLocked(): Boolean {
        return true

    }

    override fun isCredentialsNonExpired(): Boolean {
        return true

    }

    override fun isEnabled(): Boolean {
        return true
    }
}