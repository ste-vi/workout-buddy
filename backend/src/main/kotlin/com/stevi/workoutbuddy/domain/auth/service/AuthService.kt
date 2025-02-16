package com.stevi.workoutbuddy.domain.auth.service

import com.stevi.workoutbuddy.domain.auth.model.request.LoginRequest
import com.stevi.workoutbuddy.domain.auth.model.response.AuthenticationResponse
import com.stevi.workoutbuddy.domain.auth.model.request.RegistrationRequest
import com.stevi.workoutbuddy.domain.user.service.UserService
import com.stevi.workoutbuddy.exception.AuthenticationException
import com.stevi.workoutbuddy.repository.UserRepository
import com.stevi.workoutbuddy.security.TokenService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val tokenService: TokenService,
    private val userService: UserService,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional
    fun register(request: RegistrationRequest): AuthenticationResponse {
        if (userRepository.findByEmail(request.email) != null) {
            throw IllegalStateException("Email already in use")
        }

        val savedUser = userService.createUser(request)

        return AuthenticationResponse(tokenService.generate(savedUser.id))
    }

    @Transactional
    fun authenticateUser(loginRequest: LoginRequest): AuthenticationResponse {
        val user = userRepository.findByUsername(loginRequest.username)
            ?: throw AuthenticationException("Invalid credentials")

        if (!passwordEncoder.matches(loginRequest.password, user.password)) {
            throw AuthenticationException("Invalid credentials")
        }

        return AuthenticationResponse(tokenService.generate(user.id))
    }

}