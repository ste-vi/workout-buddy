package com.stevi.workoutbuddy.domain.workout.controller

import com.stevi.workoutbuddy.domain.workout.model.response.WorkoutResponse
import com.stevi.workoutbuddy.domain.workout.service.WorkoutService
import com.stevi.workoutbuddy.security.SecurityUtil
import java.time.LocalDateTime
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
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

    @PostMapping("/start/{workoutTemplateId}")
    @ResponseStatus(HttpStatus.CREATED)
    fun startWorkout(@PathVariable workoutTemplateId: Long): WorkoutResponse {
        return workoutService.startWorkout(workoutTemplateId)
    }

    @PostMapping("/ongoing/{workoutId}")
    @ResponseStatus(HttpStatus.OK)
    fun completeWorkout(@PathVariable workoutId: Long): LocalDateTime {
        return workoutService.completeWorkout(workoutId, SecurityUtil.getCurrentUserId())
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

}