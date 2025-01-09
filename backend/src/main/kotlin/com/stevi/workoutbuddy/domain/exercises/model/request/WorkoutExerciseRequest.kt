package com.stevi.workoutbuddy.domain.exercises.model.request

import com.stevi.workoutbuddy.domain.sets.model.request.SetsRequest
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class WorkoutExerciseRequest(
    @NotNull(message = "Exercise Id is required")
    val id: Long,

    @field:Size(min = 1, message = "Sets list size must be at least 1")
    val sets: List<SetsRequest> = emptyList()
)