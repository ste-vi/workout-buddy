package com.stevi.workoutbuddy.domain.exercises.service

import com.stevi.workoutbuddy.common.model.response.PageResponse
import com.stevi.workoutbuddy.domain.exercises.model.request.CreateExerciseRequest
import com.stevi.workoutbuddy.domain.exercises.model.request.WorkoutExerciseRequest
import com.stevi.workoutbuddy.domain.exercises.model.response.ExerciseResponse
import com.stevi.workoutbuddy.domain.exercises.specification.ExerciseSpecification
import com.stevi.workoutbuddy.entity.Exercise
import com.stevi.workoutbuddy.entity.Sets
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import com.stevi.workoutbuddy.exception.ResourceNotFoundException
import com.stevi.workoutbuddy.repository.ExerciseRepository
import com.stevi.workoutbuddy.repository.UserRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ExerciseService(private val exerciseRepository: ExerciseRepository, private val userRepository: UserRepository) {

    @Transactional(readOnly = true)
    fun searchExercises(
        page: Int,
        size: Int,
        query: String?,
        bodyPart: BodyPart?,
        category: ExerciseCategory?,
        excludeExercisesIds: List<Long>?
    ): PageResponse<ExerciseResponse> {
        val pageable = PageRequest.of(page, size, Sort.by("name"))
        val spec = ExerciseSpecification(
            query,
            bodyPart,
            category,
            excludeExercisesIds
        )
        val result = exerciseRepository.findAll(spec, pageable)
        return PageResponse(
            content = result.content.map { ExerciseResponse.fromEntity(it) },
            pageNumber = result.number,
            pageSize = result.size,
            totalPages = result.totalPages,
            totalElements = result.totalElements,
            last = result.isLast
        )
    }

    @Transactional
    fun createExercise(request: CreateExerciseRequest, userId: Long): ExerciseResponse {
        val user = userRepository.findById(userId).orElseThrow { ResourceNotFoundException("User not found") }
        val exercise = Exercise(
            name = request.name,
            bodyPart = request.bodyPart,
            category = request.category,
            deleted = false,
            user = user
        )
        val savedExercise = exerciseRepository.save(exercise)
        return ExerciseResponse.fromEntity(savedExercise)
    }

    @Transactional
    fun updateExercise(id: Long, request: CreateExerciseRequest): ExerciseResponse {
        val existingExercise = exerciseRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Exercise not found with id: $id") }

        existingExercise.apply {
            name = request.name
            bodyPart = request.bodyPart
            category = request.category
        }

        val updatedExercise = exerciseRepository.save(existingExercise)
        return ExerciseResponse.fromEntity(updatedExercise)
    }

    @Transactional
    fun deleteExercise(id: Long) {
        val exercise = exerciseRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Exercise not found with id: $id") }
        exerciseRepository.delete(exercise)
    }
}