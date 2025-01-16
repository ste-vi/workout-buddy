package com.stevi.workoutbuddy.domain.workout.specification

import com.stevi.workoutbuddy.entity.User
import com.stevi.workoutbuddy.entity.Workout
import com.stevi.workoutbuddy.security.SecurityUtil
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import java.time.LocalDateTime
import org.springframework.data.jpa.domain.Specification

class WorkoutSpecification(
    private val dateFrom: LocalDateTime?,
    private val dateTo: LocalDateTime?,
    private val templateId: Long?,
    private val searchQuery: String?
) : Specification<Workout> {

    override fun toPredicate(
        root: Root<Workout>,
        query: CriteriaQuery<*>?,
        criteriaBuilder: CriteriaBuilder
    ): Predicate? {
        val predicates = mutableListOf<Predicate>()

        predicates.add(criteriaBuilder.equal(root.get<User>("user").get<Long>("id"), SecurityUtil.getCurrentUserId()))

        dateFrom?.let {
            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("endAt"), it))
        }

        dateTo?.let {
            predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("endAt"), it))
        }

        templateId?.let {
            predicates.add(criteriaBuilder.equal(root.get<Long>("templateId"), it))
        }

        searchQuery?.let {
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%${it.lowercase()}%"))
        }

        return criteriaBuilder.and(*predicates.toTypedArray())
    }
}