package com.stevi.workoutbuddy.domain.auth.controller

import com.stevi.workoutbuddy.domain.auth.model.request.LoginRequest
import com.stevi.workoutbuddy.domain.auth.model.request.RegistrationRequest
import com.stevi.workoutbuddy.domain.auth.model.response.AuthenticationResponse
import com.stevi.workoutbuddy.domain.auth.service.AuthService
import com.stevi.workoutbuddy.domain.auth.service.GoogleAuthService
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val googleAuthService: GoogleAuthService,
    @Value("\${client.host}") private val clientHost: String
) {

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun register(@Valid @RequestBody request: RegistrationRequest): AuthenticationResponse {
        return authService.register(request)
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    fun loginWithCredentials(
        @RequestBody loginRequest: LoginRequest,
        response: HttpServletResponse
    ): AuthenticationResponse {
        return authService.authenticateUser(loginRequest)
    }

    @GetMapping("/google/login")
    fun googleLogin(response: HttpServletResponse) {
        response.sendRedirect(googleAuthService.getUri());
    }

    @GetMapping("/google/oauth2callback")
    @ResponseStatus(HttpStatus.OK)
    fun googleCallback(request: HttpServletRequest, response: HttpServletResponse) {
        val fullUrlBuffer = request.requestURL
        if (request.queryString != null) {
            fullUrlBuffer.append('?').append(request.queryString)
        }

        val token = googleAuthService.authenticateUser(fullUrlBuffer)

        response.sendRedirect("$clientHost/login?accessToken=$token")
    }
}