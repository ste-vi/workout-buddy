package com.stevi.workoutbuddy.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "sets")
class Sets(

    @Column
    var reps: Short?,

    @Column
    var weight: Double?,

    @Column(nullable = false)
    var completed: Boolean,

    @Column
    var completedAt: LocalDateTime?,

    @Column
    var personalRecord: Boolean = false,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_instance_id", nullable = false)
    var exerciseInstance: ExerciseInstance,
) : Base()
