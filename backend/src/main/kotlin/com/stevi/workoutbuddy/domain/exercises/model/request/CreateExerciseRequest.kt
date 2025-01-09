package com.stevi.workoutbuddy.domain.exercises.model.request

import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class CreateExerciseRequest(

    @field:NotBlank(message = "Name is required")
    @field:Size(max = 200, message = "Name must not exceed 200 characters")
    val name: String,

    @field:NotNull(message = "BodyPart is required")
    val bodyPart: BodyPart,

    @field:NotNull(message = "Category is required")
    val category: ExerciseCategory
)