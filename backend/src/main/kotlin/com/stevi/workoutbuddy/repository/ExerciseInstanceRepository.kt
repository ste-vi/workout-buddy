package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.ExerciseInstance
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository

interface ExerciseInstanceRepository : JpaRepository<ExerciseInstance, Long> {

    @EntityGraph(attributePaths = ["exercise", "sets"])
    fun findAllByWorkoutTemplateId(workoutTemplateId: Long): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise", "sets"])
    fun findAllByWorkoutId(workoutId: Long): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise", "sets"])
    fun findAllByWorkoutTemplateIdIn(workoutTemplateId: List<Long>): List<ExerciseInstance>
}