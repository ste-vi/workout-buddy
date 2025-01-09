package com.stevi.workoutbuddy.domain.tag.model.request

import jakarta.validation.constraints.NotBlank

data class TagRequest(
    val id: Long?,
    @field:NotBlank(message = "Title is required")
    val name: String,
)