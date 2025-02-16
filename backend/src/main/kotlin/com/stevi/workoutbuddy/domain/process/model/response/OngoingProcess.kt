package com.stevi.workoutbuddy.domain.user.model.response

import com.stevi.workoutbuddy.domain.workout.model.response.WorkoutResponse

data class OngoingProcess(
    val workout: WorkoutResponse?,
    val onboardingInProgress: Boolean
)