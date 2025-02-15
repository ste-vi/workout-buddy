package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.domain.workouttemplate.model.response.WorkoutTemplatePreviewResponse
import com.stevi.workoutbuddy.entity.WorkoutTemplate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface WorkoutTemplateRepository : JpaRepository<WorkoutTemplate, Long> {

    fun findByIdAndUserId(id: Long, userId: Long): WorkoutTemplate?

    @Query(
        """
        select wt 
        from WorkoutTemplate wt 
        left join fetch wt.tags 
        where wt.id = :id and wt.user.id = :userId
    """
    )
    fun findByIdAndUserIdWithTags(@Param("id") id: Long, @Param("userId") userId: Long): WorkoutTemplate?

    // temp for now
    fun findFirstByUserIdAndArchivedIsFalseOrderByIdDesc(userId: Long): WorkoutTemplate?

    @Query(
        """
        select wt 
        from WorkoutTemplate wt 
        left join fetch wt.tags 
        where wt.user.id = :userId
        order by wt.createdAt desc
    """
    )
    fun findAllByUserIdOrderByIdDesc(@Param("userId") userId: Long): List<WorkoutTemplate>

    @Query(
        """
        select new com.stevi.workoutbuddy.domain.workouttemplate.model.response.WorkoutTemplatePreviewResponse(
            wt.id, wt.title
        )
        from WorkoutTemplate wt
        order by wt.title asc
    """
    )
    fun findAllPreviewsOrderByTitleAsc(): List<WorkoutTemplatePreviewResponse>


}