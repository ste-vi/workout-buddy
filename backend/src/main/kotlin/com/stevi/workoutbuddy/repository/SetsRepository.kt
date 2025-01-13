package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.Sets
import com.stevi.workoutbuddy.repository.projection.PrSetProjection
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

}