package com.stevi.workoutbuddy.domain.exercises.controller

import com.stevi.workoutbuddy.common.model.response.PageResponse
import com.stevi.workoutbuddy.domain.exercises.model.*
import com.stevi.workoutbuddy.domain.exercises.model.request.ExerciseRequest
import com.stevi.workoutbuddy.domain.exercises.model.response.ExerciseResponse
import com.stevi.workoutbuddy.domain.exercises.service.ExerciseService
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/exercises")
class ExerciseController(private val exerciseService: ExerciseService) {

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    fun searchExercises(
        @RequestParam page: Int,
        @RequestParam size: Int,
        @RequestParam query: String?,
        @RequestParam(required = false) bodyPart: BodyPart?,
        @RequestParam(required = false) category: ExerciseCategory?,
        @RequestParam(required = false) excludeExercisesIds: List<Long>?
    ): PageResponse<ExerciseResponse> {
        return exerciseService.searchExercises(page, size, query, bodyPart, category, excludeExercisesIds)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createExercise(@Valid @RequestBody request: ExerciseRequest): ExerciseResponse {
        return exerciseService.createExercise(request)
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateExercise(@Valid @PathVariable id: Long, @RequestBody request: ExerciseRequest): ExerciseResponse {
        return exerciseService.updateExercise(id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteExercise(@PathVariable id: Long) {
        exerciseService.deleteExercise(id)
    }
}