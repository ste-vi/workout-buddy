package com.stevi.workoutbuddy.domain.workouttemplate.service

import com.stevi.workoutbuddy.domain.exercises.service.ExerciseService
import com.stevi.workoutbuddy.domain.tag.service.TagService
import com.stevi.workoutbuddy.domain.workouttemplate.model.request.WorkoutTemplateRequest
import com.stevi.workoutbuddy.domain.workouttemplate.model.response.WorkoutTemplateResponse
import com.stevi.workoutbuddy.entity.WorkoutTemplate
import com.stevi.workoutbuddy.repository.UserRepository
import com.stevi.workoutbuddy.repository.WorkoutTemplateRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class WorkoutTemplateService(
    private val workoutTemplateRepository: WorkoutTemplateRepository,
    private val exerciseService: ExerciseService,
    private val userRepository: UserRepository,
    private val tagService: TagService
) {

    @Transactional(readOnly = true)
    fun getSuggestedWorkoutTemplate(userId: Long): WorkoutTemplateResponse? {
        // todo: implement recommendation logic
        val template = workoutTemplateRepository.findFirstByUserIdOrderByIdDesc(userId)
        return template?.let { WorkoutTemplateResponse.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    // fix N+1
    fun getWorkoutTemplates(userId: Long): List<WorkoutTemplateResponse> {
        return workoutTemplateRepository.findAllByUserIdOrderByIdDesc(userId)
            .map(WorkoutTemplateResponse::fromEntity)
    }

    @Transactional
    fun createWorkoutTemplate(userId: Long, request: WorkoutTemplateRequest): WorkoutTemplateResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User not found with id: $userId") }

        val totalSets = request.exercises.sumOf { it.sets.size }
        val exercises = exerciseService.updateExercisesForWorkout(request.exercises)

        val template = WorkoutTemplate(
            title = request.title,
            estimatedDuration = 0,
            totalSets = totalSets.toShort(),
            user = user,
            tags = tagService.getTagsOrCreate(request.tags, userId).toMutableSet(),
            exercises = exercises
        )
        val savedTemplate = workoutTemplateRepository.save(template)
        return WorkoutTemplateResponse.fromEntity(savedTemplate)
    }

    @Transactional
    fun updateWorkoutTemplate(userId: Long, id: Long, request: WorkoutTemplateRequest): WorkoutTemplateResponse {
        val existingTemplate = workoutTemplateRepository.findByIdAndUserId(id, userId)
            ?: throw NoSuchElementException("Workout template not found with id: $id for user: $userId")

        val totalSets = request.exercises.sumOf { it.sets.size }
        val exercises = exerciseService.updateExercisesForWorkout(request.exercises)

        existingTemplate.title = request.title
        existingTemplate.totalSets = totalSets.toShort()
        existingTemplate.tags = tagService.getTagsOrCreate(request.tags, userId).toMutableSet()
        existingTemplate.exercises = exercises

        val updatedTemplate = workoutTemplateRepository.save(existingTemplate)
        return WorkoutTemplateResponse.fromEntity(updatedTemplate)
    }
}