package com.stevi.workoutbuddy.domain.workout.service

import com.stevi.workoutbuddy.common.model.response.PageResponse
import com.stevi.workoutbuddy.domain.exercises.model.request.ExercisePositionRequest
import com.stevi.workoutbuddy.domain.exercises.service.ExerciseInstanceService
import com.stevi.workoutbuddy.domain.sets.model.request.SetsRequest
import com.stevi.workoutbuddy.domain.sets.model.response.SetsResponse
import com.stevi.workoutbuddy.domain.sets.service.SetsService
import com.stevi.workoutbuddy.domain.tag.model.request.TagRequest
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.domain.tag.service.TagService
import com.stevi.workoutbuddy.domain.workout.model.response.WorkoutResponse
import com.stevi.workoutbuddy.domain.workout.specification.WorkoutSpecification
import com.stevi.workoutbuddy.entity.Workout
import com.stevi.workoutbuddy.exception.ResourceNotFoundException
import com.stevi.workoutbuddy.repository.WorkoutRepository
import com.stevi.workoutbuddy.repository.WorkoutTemplateRepository
import java.time.LocalDateTime
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class WorkoutService(
    private val workoutRepository: WorkoutRepository,
    private val workoutTemplateRepository: WorkoutTemplateRepository,
    private val exerciseInstanceService: ExerciseInstanceService,
    private val userService: UserService,
    private val tagService: TagService,
    private val setsService: SetsService
) {

    @Transactional(readOnly = true)
    fun findOngoingWorkout(userId: Long): WorkoutResponse? {
        val ongoingWorkout = workoutRepository.findByUserIdAndEndAtIsNull(userId)
        return ongoingWorkout?.let {
            WorkoutResponse.fromEntity(
                it,
                exerciseInstanceService.getExercisesForWorkout(it.id)
            )
        }
    }

    @Transactional(readOnly = true)
    fun findLastPerformedWorkout(userId: Long): WorkoutResponse? {
        val ongoingWorkout = workoutRepository.findFirstByUserIdAndEndAtIsNotNullOrderByEndAtDesc(userId)
        return ongoingWorkout?.let {
            WorkoutResponse.fromEntity(
                it,
                exerciseInstanceService.getExercisesForWorkout(it.id)
            )
        }
    }

    @Transactional(readOnly = true)
    fun searchWorkoutHistory(
        userId: Long,
        page: Int,
        size: Int,
        dateFrom: LocalDateTime?,
        dateTo: LocalDateTime?,
        searchQuery: String?
    ): PageResponse<WorkoutResponse> {
        val pageable = PageRequest.of(page, size)
        val specification = WorkoutSpecification(dateFrom, dateTo, searchQuery)
        val workoutPage = workoutRepository.findAll(specification, pageable)
        val workoutIds = workoutPage.content.map { it.id }
        val exerciseInstancesMap = exerciseInstanceService.getExercisesForWorkouts(workoutIds)

        return PageResponse(
            content = workoutPage.content.map {
                WorkoutResponse.fromEntity(
                    it,
                    exerciseInstancesMap[it.id] ?: emptyList()
                )
            },
            pageNumber = workoutPage.number,
            pageSize = workoutPage.size,
            totalPages = workoutPage.totalPages,
            totalElements = workoutPage.totalElements,
            last = workoutPage.isLast
        )
    }

    @Transactional
    fun startWorkout(workoutTemplateId: Long): WorkoutResponse {
        if (workoutRepository.existsByTemplateIdAndEndAtIsNull(workoutTemplateId)) {
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
            endAt = null
        )

        val instances =
            exerciseInstanceService.createWorkoutExerciseInstancesFromWorkoutTemplate(workoutTemplateId, workout)
        workout.exerciseInstances = instances.toMutableList()

        val savedWorkout = workoutRepository.save(workout)

        return WorkoutResponse.fromEntity(savedWorkout, instances)
    }

    @Transactional
    fun resetTimer(workoutId: Long, userId: Long): LocalDateTime {
        val workout = getWorkoutForUser(workoutId, userId)
        workout.createdAt = LocalDateTime.now()
        workoutRepository.save(workout)
        return workout.createdAt
    }


    @Transactional
    fun completeWorkout(workoutId: Long, userId: Long): LocalDateTime {
        val workout = getWorkoutForUser(workoutId, userId)
        workout.endAt = LocalDateTime.now()
        workoutRepository.save(workout)

        return workout.endAt!!
    }

    @Transactional
    fun deleteWorkout(workoutId: Long, userId: Long) {
        val workout = getWorkoutForUser(workoutId, userId)
        workoutRepository.delete(workout)
    }

    @Transactional
    fun addExercisesToWorkout(workoutId: Long, exercises: List<ExercisePositionRequest>, userId: Long) {
        val workout = getWorkoutForUser(workoutId, userId)
        exerciseInstanceService.addExercisesToWorkout(workout, exercises)
    }

    @Transactional
    fun replaceExercise(workoutId: Long, userId: Long, exerciseId: Long, newExerciseId: Long) {
        validateWorkoutExistenceForUser(workoutId, userId)
        exerciseInstanceService.replaceExerciseInWorkout(workoutId, exerciseId, newExerciseId)
    }

    @Transactional
    fun removeExercise(workoutId: Long, userId: Long, exerciseId: Long) {
        validateWorkoutExistenceForUser(workoutId, userId)
        exerciseInstanceService.removeExerciseInWorkout(workoutId, exerciseId)
    }

    @Transactional
    fun updateExercisesPositions(workoutId: Long, exercisePositions: List<ExercisePositionRequest>, userId: Long) {
        validateWorkoutExistenceForUser(workoutId, userId)
        exerciseInstanceService.updateExercisesPositionsForWorkout(workoutId, exercisePositions)
    }

    @Transactional
    fun updateTagsForWorkout(workoutId: Long, userId: Long, tagRequests: List<TagRequest>): List<TagResponse> {
        val workout = (workoutRepository.findByIdAndUserId(workoutId, userId)
            ?: throw ResourceNotFoundException("Workout not found"))
        val tags = tagService.getTagsOrCreate(tagRequests)

        workout.tags = tags.toMutableSet()
        workoutRepository.save(workout)

        return tags.map { TagResponse.fromEntity(it) }
    }

    @Transactional
    fun addSet(workoutId: Long, exerciseId: Long, setRequest: SetsRequest, userId: Long): SetsResponse {
        val exerciseInstance = exerciseInstanceService.getExerciseInstance(workoutId, exerciseId)
        val set = setsService.addSet(exerciseInstance, setRequest)
        return SetsResponse.fromEntity(set)
    }

    @Transactional
    fun deleteSet(workoutId: Long, setId: Long, userId: Long) {
        validateWorkoutExistenceForUser(workoutId, userId)
        setsService.deleteSet(setId)
    }

    @Transactional
    fun updateSetWeight(workoutId: Long, exerciseId: Long, setId: Long, weight: Double, userId: Long) {
        validateWorkoutExistenceForUser(workoutId, userId)
        setsService.updateSet(setId, exerciseId, weight, null)
    }

    @Transactional
    fun updateSetReps(workoutId: Long, exerciseId: Long, setId: Long, reps: Short, userId: Long) {
        validateWorkoutExistenceForUser(workoutId, userId)
        setsService.updateSet(setId, exerciseId, null, reps)
    }

    @Transactional
    fun completeSet(workoutId: Long, exerciseId: Long, setId: Long, userId: Long) {
        validateWorkoutExistenceForUser(workoutId, userId)
        setsService.completeSet(setId, exerciseId)
    }

    private fun validateWorkoutExistenceForUser(workoutId: Long, userId: Long) {
        if (!workoutRepository.existsByIdAndUserId(workoutId, userId)) {
            throw ResourceNotFoundException("Workout not found")
        }
    }

    private fun getWorkoutForUser(workoutId: Long, userId: Long): Workout {
        return workoutRepository.findByIdAndUserId(workoutId, userId)
            ?: throw ResourceNotFoundException("Workout not found")
    }

}