package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.domain.workout.model.response.LastPerformedWorkout
import com.stevi.workoutbuddy.domain.workout.model.response.WorkoutHistoryPreview
import com.stevi.workoutbuddy.entity.Workout
import java.time.LocalDateTime
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface WorkoutRepository : JpaRepository<Workout, Long>, JpaSpecificationExecutor<Workout> {

    fun existsByTemplateIdAndEndAtIsNull(workoutTemplateId: Long): Boolean

    @EntityGraph(attributePaths = ["tags"])
    fun findByUserIdAndEndAtIsNull(userId: Long): Workout?

    fun findFirstByUserIdAndEndAtIsNotNullOrderByEndAtDesc(userId: Long): Workout?

    fun findByIdAndUserId(id: Long, userId: Long): Workout?

    fun existsByIdAndUserId(id: Long, userId: Long): Boolean

    @Query(
        """
        select new com.stevi.workoutbuddy.domain.workout.model.response.LastPerformedWorkout(
            w.id, w.createdAt, w.endAt, w.template.id
        )
        from Workout w
        where w.id in (
            select max(w2.id)
            from Workout w2
            where w2.template.id in :templateIds
            and w2.endAt is not null
            group by w2.template.id
        )
    """
    )
    fun findLastPerformedWorkoutsForTemplateIdIn(@Param("templateIds") templateIds: List<Long>): List<LastPerformedWorkout>

    fun countByUserId(userId: Long): Long

    @Query(
        """
        select new com.stevi.workoutbuddy.domain.workout.model.response.WorkoutHistoryPreview(
            w.id, 
            w.title,
            w.createdAt,
            w.endAt,
            w.totalWeight,
            (select count(s) from Sets s where s.exerciseInstance.workout = w and s.personalRecord = true)
        )
        from Workout w
        where w.user.id = :userId and w.endAt >= :dateFrom and w.endAt <= :dateTo
    """
    )
    fun findWorkoutHistoryPreviewsByUserIdAndDateRange(
        @Param("userId") userId: Long,
        @Param("dateFrom") startDate: LocalDateTime,
        @Param("dateTo") endDate: LocalDateTime
    ): List<WorkoutHistoryPreview>
}