package com.stevi.workoutbuddy.domain.user.controller

import com.stevi.workoutbuddy.domain.user.model.request.PersonalInfoRequest
import com.stevi.workoutbuddy.domain.user.service.UserService
import com.stevi.workoutbuddy.security.SecurityUtil
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @PostMapping("/onboarding/complete")
    @ResponseStatus(HttpStatus.OK)
    fun completeOnboarding(@Valid @RequestBody personalInfo: PersonalInfoRequest) {
        userService.completeOnboarding(SecurityUtil.getCurrentUserId(), personalInfo)
    }
}
