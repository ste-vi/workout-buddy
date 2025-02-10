package com.stevi.workoutbuddy.security

import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource

class SecurityUtil {

    companion object {

        fun getCurrentUserId(): Long {
            val userDetails = getUserDetailsFromSecurityContext()
            return userDetails.getUserId()
        }

        private fun getUserDetailsFromSecurityContext(): CustomUserDetails {
            val usernamePasswordAuthenticationToken =
                SecurityContextHolder.getContext().authentication as UsernamePasswordAuthenticationToken
            val userDetails = usernamePasswordAuthenticationToken.principal as CustomUserDetails
            return userDetails
        }

        fun updateContext(userId: Long, request: HttpServletRequest) {
            val userDetails = CustomUserDetails(
                userId = userId,
            )

            val authToken = UsernamePasswordAuthenticationToken(userDetails, null, userDetails.authorities)
            authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
            SecurityContextHolder.getContext().authentication = authToken
        }
    }
}