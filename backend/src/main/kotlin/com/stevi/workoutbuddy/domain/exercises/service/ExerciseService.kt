package com.stevi.workoutbuddy.domain.exercises.service

import com.stevi.workoutbuddy.common.model.response.PageResponse
import com.stevi.workoutbuddy.domain.exercises.model.request.CreateExerciseRequest
import com.stevi.workoutbuddy.domain.exercises.model.response.ExerciseResponse
import com.stevi.workoutbuddy.domain.exercises.specification.ExerciseSpecification
import com.stevi.workoutbuddy.domain.sets.service.SetsService
import com.stevi.workoutbuddy.domain.workout.service.UserService
import com.stevi.workoutbuddy.entity.Exercise
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import com.stevi.workoutbuddy.repository.ExerciseRepository
import com.stevi.workoutbuddy.security.SecurityUtil
import jakarta.persistence.EntityNotFoundException
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ExerciseService(
    private val exerciseRepository: ExerciseRepository,
    private val userService: UserService,
    private val setsService: SetsService
) {

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

        val exercisesIds = result.content.map { it.id }
        val prSetForExerciseMap = setsService.getPrSetForExerciseMap(exercisesIds)

        return PageResponse(
            content = result.content.map { ExerciseResponse.fromEntity(it, prSetForExerciseMap[it.id]) },
            pageNumber = result.number,
            pageSize = result.size,
            totalPages = result.totalPages,
            totalElements = result.totalElements,
            last = result.isLast
        )
    }

    @Transactional
    fun createExercise(request: CreateExerciseRequest): ExerciseResponse {
        val exercise = Exercise(
            name = request.name,
            bodyPart = request.bodyPart,
            category = request.category,
            deleted = false,
            user = userService.getCurrentUser()
        )
        val savedExercise = exerciseRepository.save(exercise)
        return ExerciseResponse.fromEntity(savedExercise, null)
    }

    @Transactional
    fun updateExercise(id: Long, request: CreateExerciseRequest): ExerciseResponse {
        val exercise = exerciseRepository.findByIdAndUserId(id, SecurityUtil.getCurrentUserId())
            ?: throw EntityNotFoundException("Exercise not found with id: $id")

        exercise.apply {
            name = request.name
            bodyPart = request.bodyPart
            category = request.category
        }

        val updatedExercise = exerciseRepository.save(exercise)
        val prSetForExerciseMap = setsService.getPrSetForExerciseMap(listOf(id))

        return ExerciseResponse.fromEntity(updatedExercise, prSetForExerciseMap[id])
    }

    @Transactional
    fun deleteExercise(id: Long) {
        val exercise = exerciseRepository.findByIdAndUserId(id, SecurityUtil.getCurrentUserId())
            ?: throw EntityNotFoundException("Exercise not found with id: $id")
        exerciseRepository.delete(exercise)
    }
}