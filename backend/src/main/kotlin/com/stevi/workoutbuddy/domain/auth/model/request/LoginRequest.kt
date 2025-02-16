package com.stevi.workoutbuddy.domain.auth.model.request

import java.io.Serializable
import java.math.BigDecimal

data class LoginRequest(
    val username: String,
    val password: String,
) : Serializable