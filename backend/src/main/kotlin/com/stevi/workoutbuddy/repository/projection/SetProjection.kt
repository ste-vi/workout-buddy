package com.stevi.workoutbuddy.repository.projection

data class SetProjection(
    val exerciseId: Long,
    val setId: Long,
    val weight: Double?,
    val reps: Short?,
    val completed: Boolean,
    val personalRecord: Boolean,
    val previousSetId: Long?,
    val previousWeight: Double?,
    val previousReps: Short?
)