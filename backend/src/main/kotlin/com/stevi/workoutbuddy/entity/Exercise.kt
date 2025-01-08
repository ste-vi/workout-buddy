package com.stevi.workoutbuddy.entity

import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "exercises")
class Exercise(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    var bodyPart: BodyPart,

    @Column(nullable = false)
    @Enumerated(value = EnumType.STRING)
    var category: ExerciseCategory,

    @Column
    var deleted: Boolean = false,
)
