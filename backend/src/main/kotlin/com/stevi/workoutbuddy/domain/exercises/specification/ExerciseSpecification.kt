package com.stevi.workoutbuddy.domain.exercises.specification

import com.stevi.workoutbuddy.entity.Exercise
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import jakarta.persistence.criteria.CriteriaBuilder
import jakarta.persistence.criteria.CriteriaQuery
import jakarta.persistence.criteria.Predicate
import jakarta.persistence.criteria.Root
import org.springframework.data.jpa.domain.Specification

class ExerciseSpecification(
    private val name: String?,
    private val bodyPart: BodyPart?,
    private val category: ExerciseCategory?,
    private val excludeIds: List<Long>?
) : Specification<Exercise> {

    override fun toPredicate(
        root: Root<Exercise>,
        query: CriteriaQuery<*>?,
        criteriaBuilder: CriteriaBuilder
    ): Predicate? {
        val predicates = mutableListOf<Predicate>()

        name?.let {
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%${it.lowercase()}%"))
        }

        bodyPart?.let {
            predicates.add(criteriaBuilder.equal(root.get<BodyPart>("bodyPart"), it))
        }

        category?.let {
            predicates.add(criteriaBuilder.equal(root.get<ExerciseCategory>("category"), it))
        }

        excludeIds?.let {
            if (it.isNotEmpty()) {
                predicates.add(root.get<Long>("id").`in`(it).not())
            }
        }

        return criteriaBuilder.and(*predicates.toTypedArray())
    }
}