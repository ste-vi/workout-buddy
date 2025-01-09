package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.WorkoutTemplate
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository

interface WorkoutTemplateRepository : JpaRepository<WorkoutTemplate, Long> {

    fun findByIdAndUserId(id: Long, userId: Long): WorkoutTemplate?

    @EntityGraph(attributePaths = ["exercises", "tags"])
    fun findFirstByUserIdOrderByIdDesc(userId: Long): WorkoutTemplate?

    @EntityGraph(attributePaths = ["exercises", "tags"])
    fun findAllByUserIdOrderByIdDesc(userId: Long): List<WorkoutTemplate>
}