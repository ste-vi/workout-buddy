package com.stevi.workoutbuddy.domain.weight.model.request

import jakarta.validation.constraints.NotNull
import java.time.LocalDateTime

data class BodyWeightMeasureRequest(

    @field:NotNull(message = "Weight value is required")
    val value: Double,

    @field:NotNull(message = "Date is required")
    val date: LocalDateTime
)