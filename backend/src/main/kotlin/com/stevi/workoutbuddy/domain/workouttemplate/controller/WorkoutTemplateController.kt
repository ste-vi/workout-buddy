package com.stevi.workoutbuddy.domain.workouttemplate.controller

import com.stevi.workoutbuddy.domain.workouttemplate.model.request.WorkoutTemplateRequest
import com.stevi.workoutbuddy.domain.workouttemplate.model.response.WorkoutTemplateResponse
import com.stevi.workoutbuddy.domain.workouttemplate.service.WorkoutTemplateService
import com.stevi.workoutbuddy.security.SecurityUtil
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/workout-templates")
class WorkoutTemplateController(
    private val workoutTemplateService: WorkoutTemplateService
) {

    @GetMapping("/suggested")
    @ResponseStatus(HttpStatus.OK)
    fun getSuggestedWorkoutTemplate(): WorkoutTemplateResponse? {
        val userId = SecurityUtil.getCurrentUserId()
        return workoutTemplateService.getSuggestedWorkoutTemplate(userId)
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    fun getWorkoutTemplates(): List<WorkoutTemplateResponse> {
        val userId = SecurityUtil.getCurrentUserId()
        return workoutTemplateService.getWorkoutTemplates(userId)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createWorkoutTemplate(@Valid @RequestBody request: WorkoutTemplateRequest): WorkoutTemplateResponse {
        val userId = SecurityUtil.getCurrentUserId()
        return workoutTemplateService.createWorkoutTemplate(userId, request)
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateWorkoutTemplate(
        @PathVariable id: Long,
        @Valid @RequestBody request: WorkoutTemplateRequest
    ): WorkoutTemplateResponse {
        val userId = SecurityUtil.getCurrentUserId()
        return workoutTemplateService.updateWorkoutTemplate(userId, id, request)
    }
}