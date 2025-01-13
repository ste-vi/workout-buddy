package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.Tag
import com.stevi.workoutbuddy.repository.projection.WorkoutTagProjection
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TagRepository : JpaRepository<Tag, Long> {

    fun findAllByNameInAndUserId(tagNames: List<String>, userId: Long): List<Tag>

    fun findAllByUserIdOrderByCreatedAtDesc(userId: Long): List<Tag>

    @Query(
        """
        select new com.stevi.workoutbuddy.repository.projection.WorkoutTagProjection(w.id, t)
        from Workout w
        join w.tags t
        where w.id in (:workoutIds)
    """
    )
    fun findTagsForWorkoutIdIn(@Param("workoutIds") workoutIds: List<Long>): List<WorkoutTagProjection>
}
