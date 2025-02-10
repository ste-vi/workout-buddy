package com.stevi.workoutbuddy.domain.auth.controller

import com.stevi.workoutbuddy.domain.auth.model.response.AuthenticationResponse
import com.stevi.workoutbuddy.domain.auth.model.request.RegistrationRequest
import com.stevi.workoutbuddy.domain.auth.service.AuthService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@Valid @RequestBody request: RegistrationRequest): AuthenticationResponse {
        return authService.register(request)
    }
}