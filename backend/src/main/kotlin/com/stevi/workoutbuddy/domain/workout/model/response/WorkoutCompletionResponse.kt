package com.stevi.workoutbuddy.domain.workout.model.response

import java.time.LocalDateTime

data class WorkoutCompletionResponse(
    val endTime: LocalDateTime,
    val workoutsCount: Long,
    val updateTemplate: Boolean,
    val templateId: Long,
)