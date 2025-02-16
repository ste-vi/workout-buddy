package com.stevi.workoutbuddy.repository

import com.stevi.workoutbuddy.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : JpaRepository<User, Long> {

    fun findByUsername(username: String): User?

    fun findByEmail(email: String): User?

    @Query(
        value = "select case when count (*) > 0 then true else false end from User where id = :userId and activeOnboarding = true"
    )
    fun isOnboardingActive(userId: Long): Boolean
}