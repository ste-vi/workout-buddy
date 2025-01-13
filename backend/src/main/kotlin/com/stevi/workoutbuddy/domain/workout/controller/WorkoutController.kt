package com.stevi.workoutbuddy.domain.workout.controller

import com.stevi.workoutbuddy.common.model.response.PageResponse
import com.stevi.workoutbuddy.domain.exercises.model.request.ExercisePositionRequest
import com.stevi.workoutbuddy.domain.sets.model.request.SetsRequest
import com.stevi.workoutbuddy.domain.sets.model.response.SetsResponse
import com.stevi.workoutbuddy.domain.tag.model.request.TagRequest
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.domain.workout.model.response.WorkoutResponse
import com.stevi.workoutbuddy.domain.workout.service.WorkoutService
import com.stevi.workoutbuddy.security.SecurityUtil
import java.time.LocalDateTime
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/workouts")
class WorkoutController(private val workoutService: WorkoutService) {

    @GetMapping("/ongoing")
    @ResponseStatus(HttpStatus.OK)
    fun getOngoingWorkout(): WorkoutResponse? {
        return workoutService.findOngoingWorkout(SecurityUtil.getCurrentUserId())
    }

    @GetMapping("/latest")
    @ResponseStatus(HttpStatus.OK)
    fun getLastPerformedWorkout(): WorkoutResponse? {
        return workoutService.findLastPerformedWorkout(SecurityUtil.getCurrentUserId())
    }

    @GetMapping("/history")
    fun searchWorkoutHistory(
        @RequestParam page: Int,
        @RequestParam size: Int,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) dateFrom: LocalDateTime?,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) dateTo: LocalDateTime?,
        @RequestParam searchQuery: String?
    ): PageResponse<WorkoutResponse> {
        val userId = SecurityUtil.getCurrentUserId()
        return workoutService.searchWorkoutHistory(userId, page, size, dateFrom, dateTo, searchQuery)
    }

    @PostMapping("/start/{workoutTemplateId}")
    @ResponseStatus(HttpStatus.CREATED)
    fun startWorkout(@PathVariable workoutTemplateId: Long): WorkoutResponse {
        return workoutService.startWorkout(workoutTemplateId)
    }

    @PostMapping("/ongoing/{workoutId}")
    @ResponseStatus(HttpStatus.OK)
    fun completeWorkout(@PathVariable workoutId: Long, @RequestParam totalWeight: Double): LocalDateTime {
        return workoutService.completeWorkout(workoutId, totalWeight, SecurityUtil.getCurrentUserId())
    }

    @DeleteMapping("/ongoing/{workoutId}/timer")
    @ResponseStatus(HttpStatus.OK)
    fun resetTimer(@PathVariable workoutId: Long): LocalDateTime {
        return workoutService.resetTimer(workoutId, SecurityUtil.getCurrentUserId())
    }

    @DeleteMapping("/{workoutId}")
    @ResponseStatus(HttpStatus.OK)
    fun deleteWorkout(@PathVariable workoutId: Long) {
        return workoutService.deleteWorkout(workoutId, SecurityUtil.getCurrentUserId())
    }

    @PostMapping("/{workoutId}/exercises")
    @ResponseStatus(HttpStatus.OK)
    fun addExercises(
        @PathVariable workoutId: Long,
        @RequestBody exercises: List<ExercisePositionRequest>
    ) {
        workoutService.addExercisesToWorkout(workoutId, exercises, SecurityUtil.getCurrentUserId())
    }

    @PutMapping("/{workoutId}/exercises/replace")
    @ResponseStatus(HttpStatus.OK)
    fun replaceExercise(
        @PathVariable workoutId: Long,
        @RequestParam exerciseId: Long,
        @RequestParam newExerciseId: Long
    ) {
        workoutService.replaceExercise(workoutId, SecurityUtil.getCurrentUserId(), exerciseId, newExerciseId)
    }

    @DeleteMapping("/{workoutId}/exercises/{exerciseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeExerciseFromWorkout(
        @PathVariable workoutId: Long,
        @PathVariable exerciseId: Long
    ) {
        workoutService.removeExercise(workoutId, SecurityUtil.getCurrentUserId(), exerciseId)
    }

    @PutMapping("/{workoutId}/exercises/positions")
    @ResponseStatus(HttpStatus.OK)
    fun updateExercisesPositions(
        @PathVariable workoutId: Long,
        @RequestBody exercisePositions: List<ExercisePositionRequest>
    ) {
        workoutService.updateExercisesPositions(workoutId, exercisePositions, SecurityUtil.getCurrentUserId())
    }

    @PutMapping("/{workoutId}/tags")
    @ResponseStatus(HttpStatus.OK)
    fun updateTagsForWorkout(
        @PathVariable workoutId: Long,
        @RequestBody tags: List<TagRequest>
    ): List<TagResponse> {
        return workoutService.updateTagsForWorkout(workoutId, SecurityUtil.getCurrentUserId(), tags)
    }

    @PostMapping("/{workoutId}/exercises/{exerciseId}/sets")
    @ResponseStatus(HttpStatus.CREATED)
    fun addSet(
        @PathVariable workoutId: Long,
        @PathVariable exerciseId: Long,
        @RequestBody setRequest: SetsRequest
    ): SetsResponse {
        return workoutService.addSet(workoutId, exerciseId, setRequest, SecurityUtil.getCurrentUserId())
    }

    @DeleteMapping("/{workoutId}/exercises/sets/{setId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteSet(@PathVariable workoutId: Long, @PathVariable setId: Long) {
        workoutService.deleteSet(workoutId, setId, SecurityUtil.getCurrentUserId())
    }

    @PutMapping("/{workoutId}/exercises/{exerciseId}/sets/{setId}/weight")
    @ResponseStatus(HttpStatus.OK)
    fun updateSetWeight(
        @PathVariable workoutId: Long,
        @PathVariable exerciseId: Long,
        @PathVariable setId: Long,
        @RequestParam weight: Double
    ) {
        workoutService.updateSetWeight(workoutId, exerciseId, setId, weight, SecurityUtil.getCurrentUserId())
    }

    @PutMapping("/{workoutId}/exercises/{exerciseId}/sets/{setId}/reps")
    @ResponseStatus(HttpStatus.OK)
    fun updateSetReps(
        @PathVariable workoutId: Long,
        @PathVariable exerciseId: Long,
        @PathVariable setId: Long,
        @RequestParam reps: Short
    ) {
        workoutService.updateSetReps(workoutId, exerciseId, setId, reps, SecurityUtil.getCurrentUserId())
    }

    @PostMapping("/{workoutId}/exercises/{exerciseId}/sets/{setId}/complete")
    @ResponseStatus(HttpStatus.OK)
    fun completeSet(@PathVariable workoutId: Long, @PathVariable exerciseId: Long, @PathVariable setId: Long) {
        workoutService.completeSet(workoutId, exerciseId, setId, SecurityUtil.getCurrentUserId())
    }

}