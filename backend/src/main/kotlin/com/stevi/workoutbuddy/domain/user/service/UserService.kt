package com.stevi.workoutbuddy.domain.workout.service

import com.stevi.workoutbuddy.entity.User
import com.stevi.workoutbuddy.entity.Workout
import com.stevi.workoutbuddy.exception.ResourceNotFoundException
import com.stevi.workoutbuddy.repository.UserRepository
import com.stevi.workoutbuddy.repository.WorkoutRepository
import com.stevi.workoutbuddy.repository.WorkoutTemplateRepository
import com.stevi.workoutbuddy.security.SecurityUtil
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository
) {

    @Transactional(readOnly = true)
    fun getCurrentUser(): User {
        return userRepository.findById(SecurityUtil.getCurrentUserId()).orElseThrow()
    }
}