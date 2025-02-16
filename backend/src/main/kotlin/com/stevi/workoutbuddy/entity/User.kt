package com.stevi.workoutbuddy.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.GenerationType
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "users")
class User(

    @Column(nullable = false, unique = true)
    val username: String,

    @Column(nullable = false)
    val email: String,

    @Column(nullable = true)
    var password: String?,

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    var gender: Gender? = null,

    @Column(nullable = true)
    var dateOfBirth: LocalDate? = null,

    @Column(nullable = true)
    var height: Int? = null,

    @Column(nullable = false)
    var activeOnboarding: Boolean,
) : Base()
