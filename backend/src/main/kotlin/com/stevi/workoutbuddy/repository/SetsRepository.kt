package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.Sets
import com.stevi.workoutbuddy.repository.projection.PrSetProjection
import com.stevi.workoutbuddy.repository.projection.SetProjection
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional

interface SetsRepository : JpaRepository<Sets, Long> {

    fun findByIdAndExerciseInstanceExerciseId(id: Long, exerciseId: Long): Sets?

    @Modifying
    @Transactional
    @Query(
        """
        update Sets s 
        set s.personalRecord = (s.id in (
            select s2.id
            from Sets s2
            where s2.exerciseInstance.exercise.id in :exerciseIds
            and (s2.exerciseInstance.exercise.id, s2.weight * s2.reps) in (
                select s3.exerciseInstance.exercise.id, max(s3.weight * s3.reps)
                from Sets s3
                where s3.exerciseInstance.exercise.id in :exerciseIds
                group by s3.exerciseInstance.exercise.id
            )
        ))
        where s.exerciseInstance.exercise.id in :exerciseIds and s.completed = true
        """
    )
    fun updatePersonalRecords(@Param("exerciseIds") exerciseIds: List<Long>): Int

    @Modifying
    @Query("""
    update Sets s
    set s.position = (
        select count(s2.id)
        from Sets s2
        where s2.exerciseInstance.id = s.exerciseInstance.id
        and s2.createdAt <= s.createdAt
    )
    where s.exerciseInstance.id in :exerciseInstanceIds
""")
    fun recalculateSetsPositionForExerciseInstances(@Param("exerciseInstanceIds") exerciseInstanceIds: List<Long>): Int

    @Query(
        """
        select new com.stevi.workoutbuddy.repository.projection.PrSetProjection(
            s.exerciseInstance.exercise.id, s.id, s.weight, s.reps
        )
        from Sets s
        where s.exerciseInstance.exercise.id in :exerciseIds
        and s.personalRecord = true
    """
    )
    fun findPrSetsByExerciseIds(@Param("exerciseIds") exerciseIds: List<Long>): List<PrSetProjection>

    @Query("""
    select new com.stevi.workoutbuddy.repository.projection.SetProjection(
        s.exerciseInstance.exercise.id,
        s.id,
        s.weight,
        s.reps,
        s.completed,
        s.personalRecord,
        prev.id,
        prev.weight,
        prev.reps
    )
    from Sets s
    left join lateral (
        select p.id as id, p.weight as weight, p.reps as reps
        from Sets p
        join p.exerciseInstance ei
        join ei.workout w
        where ei.exercise.id = s.exerciseInstance.exercise.id
        and w.template.id = s.exerciseInstance.workout.template.id
        and w.id != s.exerciseInstance.workout.id
        and p.position = s.position
        and w.createdAt < s.exerciseInstance.workout.createdAt
        order by w.createdAt desc
        limit 1
    ) prev on true
    where s.exerciseInstance.exercise.id in (:exerciseIds)
    and s.exerciseInstance.workout.template.id = :workoutTemplateId
    and s.exerciseInstance.workout.id = :currentWorkoutId
    order by s.exerciseInstance.workout.id, s.exerciseInstance.position, s.position
    """)
    fun findSetProjectionsWithPrevious(
        @Param("exerciseIds") exerciseIds: List<Long>,
        @Param("workoutTemplateId") workoutTemplateId: Long,
        @Param("currentWorkoutId") currentWorkoutId: Long
    ): List<SetProjection>

    @Query("""
    select new com.stevi.workoutbuddy.repository.projection.SetProjection(
        s.exerciseInstance.exercise.id,
        s.id,
        s.weight,
        s.reps,
        s.completed,
        s.personalRecord,
        prev.id,
        prev.weight,
        prev.reps
    )
    from Sets s
    left join lateral (
        select p.id as id, p.weight as weight, p.reps as reps
        from Sets p
        join p.exerciseInstance ei
        join ei.workout w
        where ei.exercise.id = s.exerciseInstance.exercise.id
        and w.template.id = s.exerciseInstance.workoutTemplateId
        and p.position = s.position
        order by w.createdAt desc
        limit 1
    ) prev on true
    where s.exerciseInstance.exercise.id in :exerciseIds
    and s.exerciseInstance.workoutTemplateId in :workoutTemplateIds
    order by s.exerciseInstance.position, s.position
    """)
    fun findSetProjectionsWithPreviousForWorkoutTemplates(
        @Param("exerciseIds") exerciseIds: List<Long>,
        @Param("workoutTemplateIds") workoutTemplateIds: List<Long>
    ): List<SetProjection>
}