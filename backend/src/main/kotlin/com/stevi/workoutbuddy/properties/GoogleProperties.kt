package com.stevi.workoutbuddy.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("google")
data class GoogleProperties(
    val clientId: String,
    val clientSecret: String,
    val redirectUri: String
)