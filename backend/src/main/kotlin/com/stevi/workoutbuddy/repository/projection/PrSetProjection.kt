package com.stevi.workoutbuddy.repository.projection

data class PrSetProjection(
    val exerciseId: Long,
    val setId: Long,
    val weight: Double?,
    val reps: Short?
)