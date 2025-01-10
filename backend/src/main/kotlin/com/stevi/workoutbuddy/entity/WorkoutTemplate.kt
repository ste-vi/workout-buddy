package com.stevi.workoutbuddy.entity

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.GenerationType
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import java.time.LocalDateTime

@Entity
@Table(name = "workout_templates")
class WorkoutTemplate(

    @Column(nullable = false)
    var title: String,

    @Column
    var totalSets: Short,

    @Column
    var archived: Boolean = false,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "workout_template_tags",
        joinColumns = [JoinColumn(name = "workout_template_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    var tags: MutableSet<Tag> = mutableSetOf(),

    @OneToMany(
        mappedBy = "workoutTemplate",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    var exerciseInstances: MutableList<ExerciseInstance> = mutableListOf(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,
) : Base() {
    fun updateExerciseInstances(newInstances: List<ExerciseInstance>) {
        exerciseInstances.clear()
        exerciseInstances.addAll(newInstances)
        newInstances.forEach { it.workoutTemplate = this }
    }
}