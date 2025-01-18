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

    @Query(
        """
    select case 
        when count(w) != count(t) then true
        when exists (
            select 1 
            from ExerciseInstance w
            left join ExerciseInstance t on w.exercise.id = t.exercise.id 
                and w.position = t.position 
                and t.workoutTemplate.id = w.workout.templateId
            where w.workout.id = :workoutId
                and (t.id is null or w.id is null)
        ) then true
        when exists (
            select 1 
            from ExerciseInstance w
            join ExerciseInstance t on w.exercise.id = t.exercise.id 
                and w.position = t.position 
                and t.workoutTemplate.id = w.workout.templateId
            where w.workout.id = :workoutId
                and (select count(ws) from w.sets ws) != (select count(ts) from t.sets ts)
        ) then true
        else false
    end
    from ExerciseInstance w
    left join ExerciseInstance t on w.workout.templateId = t.workoutTemplate.id
    where w.workout.id = :workoutId
    """
    )
    fun areExerciseInstancesDifferentForWorkoutAndItsTemplate(@Param("workoutId") workoutId: Long): Boolean
}