package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.ExerciseInstance
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository

interface ExerciseInstanceRepository : JpaRepository<ExerciseInstance, Long> {

    @EntityGraph(attributePaths = ["exercise", "sets"])
    fun findAllByWorkoutTemplateId(workoutTemplateId: Long): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise", "sets"])
    fun findAllByWorkoutId(workoutId: Long): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise"])
    fun findByWorkoutIdAndExerciseId(workoutId: Long, exerciseId: Long): ExerciseInstance?

    @EntityGraph(attributePaths = ["exercise"])
    fun getAllByWorkoutId(workoutId: Long): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise", "sets"])
    fun findAllByWorkoutTemplateIdIn(workoutTemplateId: List<Long>): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise", "sets"])
    fun findAllByWorkoutIdIn(workoutId: List<Long>): List<ExerciseInstance>
}