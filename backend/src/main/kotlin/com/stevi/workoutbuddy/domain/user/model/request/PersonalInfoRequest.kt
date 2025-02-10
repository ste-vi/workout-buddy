package com.stevi.workoutbuddy.domain.user.model.request

import com.stevi.workoutbuddy.entity.Gender
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Past
import java.time.LocalDate

data class PersonalInfoRequest(
    @field:NotNull(message = "Gender is required")
    val gender: Gender,

    @field:NotNull(message = "Date of birth is required")
    @field:Past(message = "Date of birth must be in the past")
    val dateOfBirth: LocalDate,

    @field:NotNull(message = "Height is required")
    @field:Min(value = 30, message = "Height must be at least 30 cm")
    @field:Max(value = 250, message = "Height must be at most 250 cm")
    val height: Int,

    @field:NotNull(message = "Weight is required")
    @field:Min(value = 30, message = "Weight must be at least 30 kg")
    @field:Max(value = 250, message = "Weight must be at most 250 kg")
    val weight: Int
)