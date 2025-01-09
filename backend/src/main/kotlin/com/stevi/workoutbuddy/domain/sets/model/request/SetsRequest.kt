package com.stevi.workoutbuddy.domain.sets.model.request

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

data class SetsRequest(

    @field:NotNull(message = "Reps are required")
    @field:Min(value = 0, message = "Cannot be less then 0")
    @field:Max(value = 10_000, message = "Cannot be more then 10_000")
    val reps: Short,

    @field:NotNull(message = "Reps are required")
    @field:Min(value = 0, message = "Cannot be less then 0")
    @field:Max(value = 10_000, message = "Cannot be more then 10_000")
    val weight: Short,

    val completed: Boolean = false,
)