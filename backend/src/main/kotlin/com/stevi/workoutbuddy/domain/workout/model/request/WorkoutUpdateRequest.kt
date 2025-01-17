package com.stevi.workoutbuddy.domain.workout.model.request

import com.stevi.workoutbuddy.domain.exercises.model.request.WorkoutExerciseRequest
import com.stevi.workoutbuddy.domain.tag.model.request.TagRequest
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

data class WorkoutUpdateRequest(

    @field:NotBlank(message = "Title is required")
    val title: String,

    @field:NotNull(message = "Start time is required")
    val startTime: LocalDateTime,

    @field:NotNull(message = "End time is required")
    val endTime: LocalDateTime,

    val totalWeight: Double?,

    val tags: List<TagRequest> = emptyList(),

    @field:Size(min = 1, message = "Exercises list size must be at least 0")
    val exercises: List<WorkoutExerciseRequest> = emptyList()
)