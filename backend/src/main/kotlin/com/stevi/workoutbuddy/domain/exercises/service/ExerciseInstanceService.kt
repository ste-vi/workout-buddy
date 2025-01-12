package com.stevi.workoutbuddy.domain.exercises.service

import com.stevi.workoutbuddy.domain.exercises.model.request.ExercisePositionRequest
import com.stevi.workoutbuddy.domain.exercises.model.request.WorkoutExerciseRequest
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.entity.Sets
import com.stevi.workoutbuddy.entity.Workout
import com.stevi.workoutbuddy.entity.WorkoutTemplate
import com.stevi.workoutbuddy.exception.ResourceNotFoundException
import com.stevi.workoutbuddy.repository.ExerciseInstanceRepository
import com.stevi.workoutbuddy.repository.ExerciseRepository
import java.time.LocalDateTime
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
    fun getExercisesForWorkout(workoutId: Long): List<ExerciseInstance> {
        return exerciseInstanceRepository.findAllByWorkoutId(workoutId)
    }

    @Transactional(readOnly = true)
    fun getExercisesForWorkoutTemplates(workoutTemplateIds: List<Long>): Map<Long, List<ExerciseInstance>> {
        return exerciseInstanceRepository.findAllByWorkoutTemplateIdIn(workoutTemplateIds)
            .groupBy { it.workoutTemplateId!! }
    }

    @Transactional(readOnly = true)
    fun getExercisesForWorkouts(workoutIds: List<Long>): Map<Long, List<ExerciseInstance>> {
        return exerciseInstanceRepository.findAllByWorkoutIdIn(workoutIds)
            .groupBy { it.workoutId!! }
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
                workoutTemplateId = workoutTemplate.id,
                workout = null,
                workoutId = null
            ).apply {
                sets = request.sets.map { setRequest ->
                    Sets(
                        reps = setRequest.reps,
                        weight = setRequest.weight,
                        completed = setRequest.completed,
                        completedAt = if (setRequest.completed) LocalDateTime.now() else null,
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
                workoutTemplateId = workoutTemplate.id,
                workout = null,
                workoutId = null
            )

            instance.apply {
                position = request.position
                updateSets(request.sets.map { setRequest ->
                    Sets(
                        reps = setRequest.reps,
                        weight = setRequest.weight,
                        completed = setRequest.completed,
                        completedAt = if (setRequest.completed) LocalDateTime.now() else null,
                        exerciseInstance = this
                    )
                })
            }
        }

        return updatedInstances.toMutableList()
    }

    @Transactional
    fun createWorkoutExerciseInstancesFromWorkoutTemplate(
        workoutTemplateId: Long,
        workout: Workout
    ): List<ExerciseInstance> {
        val instances = exerciseInstanceRepository.findAllByWorkoutTemplateId(workoutTemplateId)

        val copiedInstances = instances.map { instance ->
            ExerciseInstance(
                exercise = instance.exercise,
                position = instance.position,
                workoutTemplate = null,
                workoutTemplateId = null,
                workout = workout,
                workoutId = null
            ).apply {
                sets = instance.sets.map { set ->
                    Sets(
                        reps = null,
                        weight = null,
                        completed = set.completed,
                        completedAt = if (set.completed) LocalDateTime.now() else null,
                        exerciseInstance = this
                    )
                }.toMutableList()
            }
        }

        return exerciseInstanceRepository.saveAll(copiedInstances)
    }

    @Transactional
    fun addExercisesToWorkout(
        workout: Workout,
        exercisesRequest: List<ExercisePositionRequest>
    ) {
        val exercises = exerciseRepository.findAllByIdIn(exercisesRequest.map { it.id })
        val exerciseMap = exercises.associateBy { it.id }

        val exerciseInstances = exercisesRequest.map { t ->
            val exercise = exerciseMap[t.id] ?: throw ResourceNotFoundException("Exercise ${t.id} not found")
            ExerciseInstance(
                exercise = exercise,
                position = t.position,
                workoutTemplate = null,
                workoutTemplateId = null,
                workout = workout,
                workoutId = null
            )
        }

        exerciseInstanceRepository.saveAll(exerciseInstances)
    }

    @Transactional
    fun replaceExerciseInWorkout(workoutId: Long, exerciseId: Long, newExerciseId: Long) {
        val exerciseInstance = getExerciseInstance(workoutId, exerciseId)
        val newExercise = exerciseRepository.findById(newExerciseId)
            .orElseThrow { ResourceNotFoundException("Exercise $newExerciseId not found") }
        exerciseInstance.exercise = newExercise
        exerciseInstanceRepository.save(exerciseInstance)
    }

    @Transactional
    fun removeExerciseInWorkout(workoutId: Long, exerciseId: Long) {
        val exerciseInstance = getExerciseInstance(workoutId, exerciseId)
        exerciseInstanceRepository.delete(exerciseInstance)
    }

    @Transactional
    fun updateExercisesPositionsForWorkout(
        workoutId: Long,
        exercisePositions: List<ExercisePositionRequest>
    ) {
        val exerciseInstances = exerciseInstanceRepository.getAllByWorkoutId(workoutId)
        val exerciseMap = exerciseInstances.associateBy { it.exercise.id }

        exercisePositions.forEach { request ->
            val exercise = exerciseMap[request.id]
                ?: throw ResourceNotFoundException("Exercise ${request.id} not found in the workout")
            exercise.position = request.position
        }

        exerciseInstanceRepository.saveAll(exerciseInstances)
    }

    @Transactional(readOnly = true)
    fun getExerciseInstance(
        workoutId: Long,
        exerciseId: Long
    ): ExerciseInstance {
        return exerciseInstanceRepository.findByWorkoutIdAndExerciseId(workoutId, exerciseId)
            ?: throw ResourceNotFoundException("Exercise $exerciseId not found in the workout")
    }
}