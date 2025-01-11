package com.stevi.workoutbuddy.domain.workout.service

import com.stevi.workoutbuddy.domain.exercises.service.ExerciseInstanceService
import com.stevi.workoutbuddy.domain.tag.service.TagService
import com.stevi.workoutbuddy.domain.workout.model.response.WorkoutResponse
import com.stevi.workoutbuddy.entity.Workout
import com.stevi.workoutbuddy.exception.ResourceNotFoundException
import com.stevi.workoutbuddy.repository.WorkoutRepository
import com.stevi.workoutbuddy.repository.WorkoutTemplateRepository
import com.stevi.workoutbuddy.security.SecurityUtil
import java.time.LocalDateTime
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class WorkoutService(
    private val workoutRepository: WorkoutRepository,
    private val workoutTemplateRepository: WorkoutTemplateRepository,
    private val exerciseInstanceService: ExerciseInstanceService,
    private val userService: UserService,
    private val tagService: TagService
) {

    @Transactional(readOnly = true)
    fun findOngoingWorkout(userId: Long): WorkoutResponse? {
        val ongoingWorkout = workoutRepository.findByUserIdAndEndTimeIsNull(userId)
        return ongoingWorkout?.let {
            WorkoutResponse.fromEntity(
                it,
                exerciseInstanceService.getExercisesForWorkout(it.id)
            )
        }
    }

    @Transactional
    fun startWorkout(workoutTemplateId: Long): WorkoutResponse {
        if (workoutRepository.existsByTemplateIdAndEndTimeIsNull(workoutTemplateId)) {
            throw IllegalStateException("You already have a workout in progress")
        }
        val user = userService.getCurrentUser()

        val workoutTemplate =
            workoutTemplateRepository.findByIdAndUserIdWithTags(workoutTemplateId, user.id)
                ?: throw ResourceNotFoundException("Workout template not found")

        val tags = tagService.copyTags(workoutTemplate.tags, user).toMutableSet()

        val workout = Workout(
            title = workoutTemplate.title,
            template = workoutTemplate,
            tags = tags,
            user = user,
            prReps = 0,
            totalWeight = 0,
            endTime = null
        )

        val instances =
            exerciseInstanceService.createWorkoutExerciseInstancesFromWorkoutTemplate(workoutTemplateId, workout)
        workout.exerciseInstances = instances.toMutableList()

        val savedWorkout = workoutRepository.save(workout)

        return WorkoutResponse.fromEntity(savedWorkout, instances)
    }

    @Transactional
    fun resetTimer(workoutId: Long, userId: Long): LocalDateTime {
        val workout = (workoutRepository.findByIdAndUserId(workoutId, userId)
            ?: throw ResourceNotFoundException("Workout not found"))
        workout.createdAt = LocalDateTime.now()
        workoutRepository.save(workout)
        return workout.createdAt
    }

    @Transactional
    fun completeWorkout(workoutId: Long, userId: Long): LocalDateTime {
        val workout = (workoutRepository.findByIdAndUserId(workoutId, userId)
            ?: throw ResourceNotFoundException("Workout not found"))
        workout.endTime = LocalDateTime.now()
        workoutRepository.save(workout)
        return workout.endTime!!
    }

    @Transactional
    fun deleteWorkout(workoutId: Long, userId: Long) {
        val workout = (workoutRepository.findByIdAndUserId(workoutId, userId)
            ?: throw ResourceNotFoundException("Workout not found"))
        workoutRepository.delete(workout)
    }
}