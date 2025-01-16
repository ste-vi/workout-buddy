package com.stevi.workoutbuddy.domain.sets.model.response

import com.stevi.workoutbuddy.entity.Sets
import com.stevi.workoutbuddy.repository.projection.PrSetProjection
import com.stevi.workoutbuddy.repository.projection.SetProjection

data class SetsResponse(
    val id: Long,
    val reps: Short?,
    val weight: Double?,
    val completed: Boolean? = true,
    val personalRecord: Boolean? = false,
    val previousSet: SetsResponse? = null,
) {
    companion object {
        fun fromEntity(entity: Sets): SetsResponse {
            return SetsResponse(
                id = entity.id,
                reps = entity.reps,
                weight = entity.weight,
                completed = entity.completed,
                personalRecord = entity.personalRecord
            )
        }

        fun fromProjection(projection: SetProjection): SetsResponse {
            return SetsResponse(
                id = projection.setId,
                reps = projection.reps,
                weight = projection.weight,
                completed = projection.completed,
                personalRecord = projection.personalRecord,
                previousSet = projection.previousSetId?.let {
                    SetsResponse(
                        id = it,
                        reps = projection.previousReps,
                        weight = projection.previousWeight
                    )
                }
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