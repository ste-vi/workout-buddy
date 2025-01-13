package com.stevi.workoutbuddy.domain.workout.model.response

import com.fasterxml.jackson.annotation.JsonIgnore
import java.time.LocalDateTime

data class LastPerformedWorkout(
    val id: Long,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,
    @JsonIgnore
    val templateId: Long,
)