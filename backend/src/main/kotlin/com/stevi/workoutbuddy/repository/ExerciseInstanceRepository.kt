package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.ExerciseInstance
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ExerciseInstanceRepository : JpaRepository<ExerciseInstance, Long> {

    @EntityGraph(attributePaths = ["exercise"])
    fun findAllByWorkoutTemplateId(workoutTemplateId: Long): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise"])
    fun findAllByWorkoutId(workoutId: Long): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise"])
    fun findByWorkoutIdAndExerciseId(workoutId: Long, exerciseId: Long): ExerciseInstance?

    @Query("select ei from ExerciseInstance ei join ei.sets s where ei.workout.id = :workoutId and s.id = :setId")
    fun findByWorkoutIdAndSetId(@Param("workoutId") workoutId: Long, @Param("setId") setId: Long): ExerciseInstance?

    @EntityGraph(attributePaths = ["exercise"])
    fun getAllByWorkoutId(workoutId: Long): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise"])
    fun findAllByWorkoutTemplateIdIn(workoutTemplateId: List<Long>): List<ExerciseInstance>

    @EntityGraph(attributePaths = ["exercise"])
    fun findAllByWorkoutIdIn(workoutId: List<Long>): List<ExerciseInstance>
}