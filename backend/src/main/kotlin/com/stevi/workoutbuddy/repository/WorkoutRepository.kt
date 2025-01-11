package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.Workout
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository

interface WorkoutRepository : JpaRepository<Workout, Long> {

    fun existsByTemplateIdAndEndTimeIsNull(workoutTemplateId: Long): Boolean

    @EntityGraph(attributePaths = ["tags"])
    fun findByUserIdAndEndTimeIsNull(userId: Long): Workout?

    fun findByIdAndUserId(id: Long, userId: Long): Workout?
}