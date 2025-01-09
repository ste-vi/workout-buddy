package com.stevi.workoutbuddy.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.GenerationType
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(

    @Column(nullable = false, unique = true)
    val username: String,

    @Column(nullable = false)
    val email: String,
) : Base()
