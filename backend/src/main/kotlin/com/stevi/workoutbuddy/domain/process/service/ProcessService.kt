package com.stevi.workoutbuddy.domain.process.service

import com.stevi.workoutbuddy.domain.user.model.response.OngoingProcess
import com.stevi.workoutbuddy.domain.user.service.UserService
import com.stevi.workoutbuddy.domain.workout.service.WorkoutService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProcessService(
    private val workoutService: WorkoutService,
    private val userService: UserService
) {

    @Transactional(readOnly = true)
    fun findOngoingProcess(currentUserId: Long): OngoingProcess? {
        val ongoingWorkout = workoutService.findOngoingWorkout(currentUserId)
        val onboardingInProgress = userService.isOnboardingActive(currentUserId)
        return OngoingProcess(ongoingWorkout, onboardingInProgress)
    }
}