package com.stevi.workoutbuddy.domain.weight.model.response

import com.stevi.workoutbuddy.entity.BodyWeightMeasure
import java.time.LocalDateTime

data class BodyWeightMeasureResponse(
    val id: Long,
    val value: Double,
    val date: LocalDateTime,
) {
    companion object {
        fun fromEntity(bodyWeightMeasure: BodyWeightMeasure): BodyWeightMeasureResponse {
            return BodyWeightMeasureResponse(
                id = bodyWeightMeasure.id,
                value = bodyWeightMeasure.weight,
                date = bodyWeightMeasure.date
            )
        }
    }
}