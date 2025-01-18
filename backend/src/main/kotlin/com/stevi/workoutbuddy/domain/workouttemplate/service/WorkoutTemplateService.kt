package com.stevi.workoutbuddy.domain.workouttemplate.service

import com.stevi.workoutbuddy.domain.exercises.service.ExerciseInstanceService
import com.stevi.workoutbuddy.domain.sets.service.SetsService
import com.stevi.workoutbuddy.domain.tag.service.TagService
import com.stevi.workoutbuddy.domain.workout.service.UserService
import com.stevi.workoutbuddy.domain.workout.service.WorkoutService
import com.stevi.workoutbuddy.domain.workouttemplate.model.request.WorkoutTemplateRequest
import com.stevi.workoutbuddy.domain.workouttemplate.model.response.WorkoutTemplatePreviewResponse
import com.stevi.workoutbuddy.domain.workouttemplate.model.response.WorkoutTemplateResponse
import com.stevi.workoutbuddy.entity.WorkoutTemplate
import com.stevi.workoutbuddy.repository.WorkoutTemplateRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class WorkoutTemplateService(
    private val workoutTemplateRepository: WorkoutTemplateRepository,
    private val exerciseInstanceService: ExerciseInstanceService,
    private val userService: UserService,
    private val tagService: TagService,
    private val setsService: SetsService,
    private val workoutService: WorkoutService
) {

    @Transactional(readOnly = true)
    fun getSuggestedWorkoutTemplate(userId: Long): WorkoutTemplateResponse? {
        // todo: implement recommendation logic
        val template = workoutTemplateRepository.findFirstByUserIdOrderByIdDesc(userId)
        return template?.let {
            val exerciseInstances = exerciseInstanceService.getExercisesForWorkoutTemplate(template.id)
            val exerciseIds = exerciseInstances.map { ex -> ex.exercise.id }
            val prSetForExerciseMap = setsService.getPrSetForExerciseMap(exerciseIds)
            val lastPerformedWorkout = workoutService.getLastPerformedWorkoutToTemplateMap(listOf(it.id))[it.id]
            val setProjections = setsService.getSetProjectionsForWorkoutTemplates(exerciseIds, listOf(template.id))
            WorkoutTemplateResponse.fromEntity(
                it,
                exerciseInstances,
                setProjections,
                prSetForExerciseMap,
                lastPerformedWorkout
            )
        }
    }

    @Transactional(readOnly = true)
    fun getWorkoutTemplates(userId: Long): List<WorkoutTemplateResponse> {
        val workoutTemplates = workoutTemplateRepository.findAllByUserIdOrderByIdDesc(userId)
        val workoutTemplateIds = workoutTemplates.map { it.id }
        val exerciseInstancesMap = exerciseInstanceService.getExercisesForWorkoutTemplates(workoutTemplateIds)
        val exerciseIds = exerciseInstancesMap.values.flatten().map { it.exercise.id }
        val setProjections = setsService.getSetProjectionsForWorkoutTemplates(exerciseIds, workoutTemplateIds)
        val prSetForExerciseMap =
            setsService.getPrSetForExerciseMap(exerciseIds)
        val lastPerformedWorkoutMap = workoutService.getLastPerformedWorkoutToTemplateMap(workoutTemplateIds)

        return workoutTemplates.map { template ->
            WorkoutTemplateResponse.fromEntity(
                template,
                exerciseInstancesMap[template.id] ?: emptyList(),
                setProjections,
                prSetForExerciseMap,
                lastPerformedWorkoutMap[template.id]
            )
        }
    }

    @Transactional
    fun createWorkoutTemplate(request: WorkoutTemplateRequest): WorkoutTemplateResponse {
        val template = WorkoutTemplate(
            title = request.title,
            totalSets = request.exercises.sumOf { it.sets.size }.toShort(),
            user = userService.getCurrentUser(),
            tags = tagService.getTagsOrCreate(request.tags).toMutableSet(),
            exerciseInstances = mutableListOf(),
        )
        val savedTemplate = workoutTemplateRepository.save(template)

        val exInstances = exerciseInstanceService.createExercisesForWorkoutTemplate(request.exercises, savedTemplate)
        savedTemplate.exerciseInstances = exInstances

        setsService.recalculatePositionsForExerciseInstance(exInstances.map { it.id })

        val exerciseIds = exInstances.map { it.exercise.id }
        val setProjections = setsService.getSetProjectionsForWorkoutTemplates(exerciseIds, listOf(template.id))
        val prSetForExerciseMap = setsService.getPrSetForExerciseMap(exerciseIds)

        return WorkoutTemplateResponse.fromEntity(savedTemplate, exInstances, setProjections, prSetForExerciseMap, null)
    }

    @Transactional
    fun updateWorkoutTemplate(userId: Long, id: Long, request: WorkoutTemplateRequest): WorkoutTemplateResponse {
        val existingTemplate = workoutTemplateRepository.findByIdAndUserId(id, userId)
            ?: throw NoSuchElementException("Workout template not found with id: $id")

        val totalSets = request.exercises.sumOf { it.sets.size }
        val exInstances = exerciseInstanceService.updateExercisesForWorkoutTemplate(request.exercises, existingTemplate)

        existingTemplate.title = request.title
        existingTemplate.totalSets = totalSets.toShort()
        existingTemplate.tags = tagService.getTagsOrCreate(request.tags).toMutableSet()
        existingTemplate.updateExerciseInstances(exInstances)

        val updatedTemplate = workoutTemplateRepository.save(existingTemplate)

        setsService.recalculatePositionsForExerciseInstance(exInstances.map { it.id })

        val exerciseIds = exInstances.map { ex -> ex.exercise.id }
        val setProjections = setsService.getSetProjectionsForWorkoutTemplates(exerciseIds, listOf(id))
        val prSetForExerciseMap = setsService.getPrSetForExerciseMap(exerciseIds)

        val lastPerformedWorkout = workoutService.getLastPerformedWorkoutToTemplateMap(listOf(id))[id]

        return WorkoutTemplateResponse.fromEntity(
            updatedTemplate,
            exInstances,
            setProjections,
            prSetForExerciseMap,
            lastPerformedWorkout
        )
    }

    @Transactional
    fun updateWorkoutTemplateFromTemplate(
        userId: Long,
        id: Long,
        request: WorkoutTemplateRequest
    ) {
        val existingTemplate = workoutTemplateRepository.findByIdAndUserId(id, userId)
            ?: throw NoSuchElementException("Workout template not found with id: $id")

        val totalSets = request.exercises.sumOf { it.sets.size }
        val exInstances = exerciseInstanceService.updateExercisesForWorkoutTemplateFromWorkout(request.exercises, existingTemplate)

        existingTemplate.totalSets = totalSets.toShort()
        existingTemplate.updateExerciseInstances(exInstances)

        workoutTemplateRepository.save(existingTemplate)

        setsService.recalculatePositionsForExerciseInstance(exInstances.map { it.id })
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

    @Transactional(readOnly = true)
    fun getWorkoutTemplatePreviews(): List<WorkoutTemplatePreviewResponse> {
        return workoutTemplateRepository.findAllPreviewsOrderByTitleAsc()
    }
}