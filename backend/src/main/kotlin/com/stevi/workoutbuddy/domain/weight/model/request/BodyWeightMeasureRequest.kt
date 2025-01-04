package com.stevi.workoutbuddy.domain.weight.model.request

import java.time.LocalDateTime

data class BodyWeightMeasureRequest(
    val value: Double,
    val date: LocalDateTime
)