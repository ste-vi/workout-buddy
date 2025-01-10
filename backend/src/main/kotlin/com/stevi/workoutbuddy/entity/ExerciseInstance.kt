package com.stevi.workoutbuddy.entity

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table

@Entity
@Table(name = "exercise_instances")
class ExerciseInstance(

    @Column(nullable = false)
    var position: Short,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    var exercise: Exercise,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_template_id")
    var workoutTemplate: WorkoutTemplate?,

    @Column(name = "workout_template_id", insertable = false, updatable = false)
    var workoutTemplateId: Long?,

    @OneToMany(
        mappedBy = "exerciseInstance",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    var sets: MutableList<Sets> = mutableListOf()
) : Base() {
    fun updateSets(newSets: List<Sets>) {
        sets.clear()
        sets.addAll(newSets)
        newSets.forEach { it.exerciseInstance = this }
    }
}
