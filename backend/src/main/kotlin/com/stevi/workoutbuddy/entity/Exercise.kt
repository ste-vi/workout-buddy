package com.stevi.workoutbuddy.entity

import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

@Entity
@Table(name = "exercises")
class Exercise(

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User

) : Base()
