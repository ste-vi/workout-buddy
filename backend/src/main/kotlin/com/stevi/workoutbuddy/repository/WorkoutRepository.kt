package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.Workout
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor

interface WorkoutRepository : JpaRepository<Workout, Long>, JpaSpecificationExecutor<Workout> {

    fun existsByTemplateIdAndEndAtIsNull(workoutTemplateId: Long): Boolean

    @EntityGraph(attributePaths = ["tags"])
    fun findByUserIdAndEndAtIsNull(userId: Long): Workout?

    fun findFirstByUserIdAndEndAtIsNotNullOrderByEndAtDesc(userId: Long): Workout?

    fun findByIdAndUserId(id: Long, userId: Long): Workout?

    fun existsByIdAndUserId(id: Long, userId: Long): Boolean
}