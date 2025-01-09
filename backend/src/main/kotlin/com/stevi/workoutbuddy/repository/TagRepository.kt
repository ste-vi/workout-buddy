package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.Tag
import org.springframework.data.jpa.repository.JpaRepository

interface TagRepository : JpaRepository<Tag, Long> {

    fun findAllByNameInAndUserId(tagNames: List<String>, userId: Long): List<Tag>

    fun findAllByUserIdOrderByCreatedAtDesc(userId: Long): List<Tag>
}