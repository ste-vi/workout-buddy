package com.stevi.workoutbuddy.domain.exercises.service

import com.stevi.workoutbuddy.domain.exercises.model.request.WorkoutExerciseRequest
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.entity.Sets
import com.stevi.workoutbuddy.entity.WorkoutTemplate
import com.stevi.workoutbuddy.repository.ExerciseInstanceRepository
import com.stevi.workoutbuddy.repository.ExerciseRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ExerciseInstanceService(
    private val exerciseInstanceRepository: ExerciseInstanceRepository,
    private val exerciseRepository: ExerciseRepository,
) {

    @Transactional(readOnly = true)
    fun getExercisesForWorkoutTemplate(workoutTemplateId: Long): List<ExerciseInstance> {
        return exerciseInstanceRepository.findAllByWorkoutTemplateId(workoutTemplateId)
    }

    @Transactional(readOnly = true)
    fun getExercisesForWorkoutTemplates(workoutTemplateIds: List<Long>): Map<Long, List<ExerciseInstance>> {
        return exerciseInstanceRepository.findAllByWorkoutTemplateIdIn(workoutTemplateIds)
            .groupBy { it.workoutTemplateId!! }
    }

    @Transactional
    fun createExercisesForWorkoutTemplate(
        exerciseRequests: List<WorkoutExerciseRequest>,
        workoutTemplate: WorkoutTemplate
    ): MutableList<ExerciseInstance> {
        val exercises = exerciseRepository.findAllByIdIn(exerciseRequests.map { it.id }).associateBy { it.id }

        val instances = exerciseRequests.map { request ->
            val exercise = exercises[request.id] ?: throw IllegalArgumentException("Exercise not found: ${request.id}")
            ExerciseInstance(
                exercise = exercise,
                position = request.position,
                workoutTemplate = workoutTemplate,
                workoutTemplateId = workoutTemplate.id
            ).apply {
                sets = request.sets.map { setRequest ->
                    Sets(
                        reps = setRequest.reps,
                        weight = setRequest.weight,
                        completed = setRequest.completed,
                        exerciseInstance = this
                    )
                }.toMutableList()
            }
        }

        return exerciseInstanceRepository.saveAll(instances)
    }


    @Transactional
    fun updateExercisesForWorkoutTemplate(
        exerciseRequests: List<WorkoutExerciseRequest>,
        workoutTemplate: WorkoutTemplate
    ): MutableList<ExerciseInstance> {
        val existingInstances = workoutTemplate.exerciseInstances.associateBy { it.exercise.id }
        val exercises = exerciseRepository.findAllByIdIn(exerciseRequests.map { it.id }).associateBy { it.id }

        val updatedInstances = exerciseRequests.map { request ->
            val exercise = exercises[request.id] ?: throw IllegalArgumentException("Exercise not found: ${request.id}")
            val instance = existingInstances[request.id] ?: ExerciseInstance(
                exercise = exercise,
                position = request.position,
                workoutTemplate = workoutTemplate,
                workoutTemplateId = workoutTemplate.id
            )

            instance.apply {
                position = request.position
                updateSets(request.sets.map { setRequest ->
                    Sets(
                        reps = setRequest.reps,
                        weight = setRequest.weight,
                        completed = setRequest.completed,
                        exerciseInstance = this
                    )
                })
            }
        }

        return updatedInstances.toMutableList()
    }
}