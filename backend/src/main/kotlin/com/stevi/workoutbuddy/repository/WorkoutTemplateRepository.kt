package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.WorkoutTemplate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface WorkoutTemplateRepository : JpaRepository<WorkoutTemplate, Long> {

    fun findByIdAndUserId(id: Long, userId: Long): WorkoutTemplate?

    // temp for now
    fun findFirstByUserIdOrderByIdDesc(userId: Long): WorkoutTemplate?

    @Query(
        """
        select distinct wt 
        from WorkoutTemplate wt 
        left join fetch wt.tags 
        where wt.user.id = :userId
        order by wt.createdAt desc
    """
    )
    fun findAllByUserIdOrderByIdDesc(@Param("userId") userId: Long): List<WorkoutTemplate>
}