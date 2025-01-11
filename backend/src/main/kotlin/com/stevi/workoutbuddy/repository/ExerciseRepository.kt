package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.Exercise
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.repository.PagingAndSortingRepository

interface ExerciseRepository : JpaRepository<Exercise, Long>, JpaSpecificationExecutor<Exercise> {

    fun findAllByIdIn(map: List<Long>): List<Exercise>

    fun findByIdAndUserId(id: Long, userId: Long): Exercise?
}