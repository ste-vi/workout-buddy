package com.stevi.workoutbuddy.domain.workouttemplate.model.request

import com.stevi.workoutbuddy.domain.exercises.model.request.WorkoutExerciseRequest
import com.stevi.workoutbuddy.domain.tag.model.request.TagRequest
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class WorkoutTemplateRequest(

    @field:NotBlank(message = "Title is required")
    val title: String,

    val tags: List<TagRequest> = emptyList(),

    @field:Size(min = 1, message = "Exercises list size must be at least 0")
    val exercises: List<WorkoutExerciseRequest> = emptyList()
)