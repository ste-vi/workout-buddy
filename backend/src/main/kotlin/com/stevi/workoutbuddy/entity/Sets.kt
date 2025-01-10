package com.stevi.workoutbuddy.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "sets")
class Sets(

    @Column(nullable = false)
    var reps: Short,

    @Column(nullable = false)
    var weight: Short,

    @Column(nullable = false)
    var completed: Boolean,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_instance_id", nullable = false)
    var exerciseInstance: ExerciseInstance,
) : Base()
