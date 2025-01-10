package com.stevi.workoutbuddy.domain.workouttemplate.service

import com.stevi.workoutbuddy.domain.exercises.service.ExerciseInstanceService
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
    private val exerciseInstanceService: ExerciseInstanceService,
    private val userRepository: UserRepository,
    private val tagService: TagService
) {

    @Transactional(readOnly = true)
    fun getSuggestedWorkoutTemplate(userId: Long): WorkoutTemplateResponse? {
        // todo: implement recommendation logic
        val template = workoutTemplateRepository.findFirstByUserIdOrderByIdDesc(userId)
        return template?.let {
            val exerciseInstances = exerciseInstanceService.getExercisesForWorkoutTemplate(template.id)
            WorkoutTemplateResponse.fromEntity(it, exerciseInstances)
        }
    }

    @Transactional(readOnly = true)
    fun getWorkoutTemplates(userId: Long): List<WorkoutTemplateResponse> {
        val workoutTemplates = workoutTemplateRepository.findAllByUserIdOrderByIdDesc(userId)
        val workoutTemplateIds = workoutTemplates.map { it.id }
        val exerciseInstancesMap = exerciseInstanceService.getExercisesForWorkoutTemplates(workoutTemplateIds)

        return workoutTemplates.map { template ->
            WorkoutTemplateResponse.fromEntity(template, exerciseInstancesMap[template.id] ?: emptyList())
        }
    }

    @Transactional
    fun createWorkoutTemplate(userId: Long, request: WorkoutTemplateRequest): WorkoutTemplateResponse {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User not found with id: $userId") }

        val template = WorkoutTemplate(
            title = request.title,
            totalSets = request.exercises.sumOf { it.sets.size }.toShort(),
            user = user,
            tags = tagService.getTagsOrCreate(request.tags, userId).toMutableSet(),
            exerciseInstances = mutableListOf(),
        )
        val savedTemplate = workoutTemplateRepository.save(template)

        val exInstances = exerciseInstanceService.createExercisesForWorkoutTemplate(request.exercises, savedTemplate)
        savedTemplate.exerciseInstances = exInstances

        return WorkoutTemplateResponse.fromEntity(savedTemplate, exInstances)
    }

    @Transactional
    fun updateWorkoutTemplate(userId: Long, id: Long, request: WorkoutTemplateRequest): WorkoutTemplateResponse {
        val existingTemplate = workoutTemplateRepository.findByIdAndUserId(id, userId)
            ?: throw NoSuchElementException("Workout template not found with id: $id")

        val totalSets = request.exercises.sumOf { it.sets.size }
        val exInstances = exerciseInstanceService.updateExercisesForWorkoutTemplate(request.exercises, existingTemplate)

        existingTemplate.title = request.title
        existingTemplate.totalSets = totalSets.toShort()
        existingTemplate.tags = tagService.getTagsOrCreate(request.tags, userId).toMutableSet()
        existingTemplate.updateExerciseInstances(exInstances)

        val updatedTemplate = workoutTemplateRepository.save(existingTemplate)
        return WorkoutTemplateResponse.fromEntity(updatedTemplate, exInstances)
    }

    @Transactional
    fun archiveWorkoutTemplate(id: Long, userId: Long) {
        val existingTemplate = workoutTemplateRepository.findByIdAndUserId(id, userId)
            ?: throw NoSuchElementException("Workout template not found with id: $id")
        existingTemplate.archived = true
        workoutTemplateRepository.save(existingTemplate)
    }

    @Transactional
    fun unArchiveWorkoutTemplate(id: Long, userId: Long) {
        val existingTemplate = workoutTemplateRepository.findByIdAndUserId(id, userId)
            ?: throw NoSuchElementException("Workout template not found with id: $id")
        existingTemplate.archived = false
        workoutTemplateRepository.save(existingTemplate)
    }
}