package com.stevi.workoutbuddy.domain.workout.model.response

import java.time.LocalDateTime

data class WorkoutHistoryPreview(
    val id: Long,
    val title: String,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,
    val totalWeight: Double?,
    val prReps: Long,
)