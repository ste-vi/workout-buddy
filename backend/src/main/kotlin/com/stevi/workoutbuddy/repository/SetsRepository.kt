package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.Sets
import org.springframework.data.jpa.repository.JpaRepository

interface SetsRepository : JpaRepository<Sets, Long> {

    fun findByIdAndExerciseInstanceExerciseId(id: Long, exerciseId: Long): Sets?
}