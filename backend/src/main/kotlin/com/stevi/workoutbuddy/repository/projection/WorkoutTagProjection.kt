package com.stevi.workoutbuddy.repository.projection

import com.stevi.workoutbuddy.entity.Tag

data class WorkoutTagProjection(
    val workoutId: Long,
    val tag: Tag
)