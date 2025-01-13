package com.stevi.workoutbuddy.domain.sets.model.response

import com.stevi.workoutbuddy.entity.Sets
import com.stevi.workoutbuddy.repository.projection.PrSetProjection

data class SetsResponse(
    val id: Long,
    val reps: Short?,
    val weight: Double?,
    val completed: Boolean,
    val personalRecord: Boolean
) {
    companion object {
        fun fromEntity(entity: Sets): SetsResponse {
            return SetsResponse(
                id = entity.id,
                reps = entity.reps,
                weight = entity.weight,
                completed = entity.completed,
                personalRecord = entity.personalRecord,
            )
        }

        fun fromPrSetProjection(projection: PrSetProjection): SetsResponse {
            return SetsResponse(
                id = projection.setId,
                reps = projection.reps,
                weight = projection.weight,
                completed = true,
                personalRecord = true,
            )
        }
    }
}