package com.stevi.workoutbuddy.domain.sets.model.response

import com.stevi.workoutbuddy.entity.Sets

data class SetsResponse(
    val id: Long,
    val reps: Short?,
    val weight: Double?,
    val completed: Boolean,
) {
    companion object {
        fun fromEntity(entity: Sets): SetsResponse {
            return SetsResponse(
                id = entity.id,
                reps = entity.reps,
                weight = entity.weight,
                completed = entity.completed,
            )
        }
    }
}