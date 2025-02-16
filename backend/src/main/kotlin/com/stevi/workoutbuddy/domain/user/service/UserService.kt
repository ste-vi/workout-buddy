package com.stevi.workoutbuddy.domain.user.service

import com.stevi.workoutbuddy.domain.auth.model.request.RegistrationRequest
import com.stevi.workoutbuddy.domain.exercises.service.ExerciseService
import com.stevi.workoutbuddy.domain.user.model.request.PersonalInfoRequest
import com.stevi.workoutbuddy.domain.weight.service.BodyWeightMeasureService
import com.stevi.workoutbuddy.entity.User
import com.stevi.workoutbuddy.exception.ResourceNotFoundException
import com.stevi.workoutbuddy.repository.UserRepository
import com.stevi.workoutbuddy.security.SecurityUtil
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val exerciseService: ExerciseService,
    private val bodyWeightMeasureService: BodyWeightMeasureService
) {

    @Transactional(readOnly = true)
    fun getCurrentUser(): User {
        return userRepository.findById(SecurityUtil.getCurrentUserId()).orElseThrow()
    }

    @Transactional(readOnly = true)
    fun findByEmail(email: String): User? {
        return userRepository.findByEmail(email)
    }

    @Transactional
    fun createUser(request: RegistrationRequest): User {
        val user = User(
            username = request.username,
            email = request.email,
            password = passwordEncoder.encode(request.password),
            activeOnboarding = true
        )

        val savedUser = userRepository.save(user)

        exerciseService.initDefaultExercisesForUser(savedUser)

        return savedUser
    }

    @Transactional
    fun createUser(email: String, username: String): User {
        val user = User(
            username = username,
            email = email,
            password = null,
            activeOnboarding = true
        )

        val savedUser = userRepository.save(user)

        exerciseService.initDefaultExercisesForUser(savedUser)

        return savedUser
    }

    @Transactional
    fun completeOnboarding(userId: Long, personalInfo: PersonalInfoRequest) {
        val user = userRepository.findById(userId).orElseThrow { ResourceNotFoundException("User not found") }

        user.apply {
            gender = personalInfo.gender
            dateOfBirth = personalInfo.dateOfBirth
            height = personalInfo.height
            activeOnboarding = false
        }

        userRepository.save(user)

        bodyWeightMeasureService.initBodyWeightMeasure(personalInfo.weight, user)
    }

    @Transactional(readOnly = true)
    fun isOnboardingActive(userId: Long): Boolean {
        return userRepository.isOnboardingActive(userId)
    }
}