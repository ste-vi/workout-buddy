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
    // composite id

    @Column(nullable = false)
    val reps: Short,

    @Column(nullable = false)
    val weight: Short,

    @Column(nullable = false)
    val completed: Boolean,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    var exercise: Exercise,
) : Base()
