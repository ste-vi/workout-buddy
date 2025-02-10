package com.stevi.workoutbuddy.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val tokenService: TokenService
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token: String? = request.getHeader("Authorization")
        if (token == null) {
            filterChain.doFilter(request, response)
            return
        }

        if (SecurityContextHolder.getContext().authentication == null && !tokenService.isExpired(token)) {
            val userId = tokenService.extractUserId(token)
            SecurityUtil.updateContext(userId, request)
        }
        filterChain.doFilter(request, response)
    }
}