package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.BodyWeightMeasure
import java.time.LocalDateTime
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.PagingAndSortingRepository
import org.springframework.stereotype.Repository

@Repository
interface BodyWeightMeasureRepository : JpaRepository<BodyWeightMeasure, Long>, PagingAndSortingRepository<BodyWeightMeasure, Long> {

    fun findByUserIdOrderByDateDesc(userId: Long, pageable: Pageable): List<BodyWeightMeasure>

    fun findByUserId(userId: Long, pageable: Pageable): Page<BodyWeightMeasure>
}