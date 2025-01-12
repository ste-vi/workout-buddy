package com.stevi.workoutbuddy.entity

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "workouts")
class Workout(

    @Column(nullable = false)
    var title: String,

    @Column
    var prReps: Short,

    @Column
    var totalWeight: Short,

    @Column
    var endAt: LocalDateTime?,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "workout_tags",
        joinColumns = [JoinColumn(name = "workout_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    var tags: MutableSet<Tag> = mutableSetOf(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_template_id", nullable = false)
    val template: WorkoutTemplate,

    @OneToMany(
        mappedBy = "workout",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    var exerciseInstances: MutableList<ExerciseInstance> = mutableListOf(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User

) : Base()
