package com.stevi.workoutbuddy.domain.weight.controller

import com.stevi.workoutbuddy.common.model.response.PageResponse
import com.stevi.workoutbuddy.domain.weight.model.request.BodyWeightMeasureRequest
import com.stevi.workoutbuddy.domain.weight.model.response.BodyWeightMeasureResponse
import com.stevi.workoutbuddy.domain.weight.service.BodyWeightMeasureService
import com.stevi.workoutbuddy.security.SecurityUtil
import jakarta.validation.Valid
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
@RequestMapping("/api/body-weight-measures")
class BodyWeightMeasureController(private val bodyWeightMeasureService: BodyWeightMeasureService) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun addBodyWeightMeasure(@Valid @RequestBody request: BodyWeightMeasureRequest): BodyWeightMeasureResponse {
        return bodyWeightMeasureService.addBodyWeightMeasure(request)
    }

    @GetMapping("/last-5")
    @ResponseStatus(HttpStatus.OK)
    fun getLast5BodyWeightMeasures(): List<BodyWeightMeasureResponse> {
        val userId = SecurityUtil.getCurrentUserId()
        return bodyWeightMeasureService.getLastNBodyWeightMeasuresForUser(userId, 5)
    }

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    fun searchBodyWeightMeasures(
        @RequestParam page: Int,
        @RequestParam size: Int,
        @RequestParam sortOrder: String
    ): PageResponse<BodyWeightMeasureResponse> {
        val userId = SecurityUtil.getCurrentUserId()
        return bodyWeightMeasureService.searchBodyWeightMeasures(userId, page, size, sortOrder)
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    fun updateBodyWeightMeasure(
        @PathVariable id: Long,
        @Valid  @RequestBody request: BodyWeightMeasureRequest
    ): BodyWeightMeasureResponse {
        return bodyWeightMeasureService.updateBodyWeightMeasure(id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteBodyWeightMeasure(@PathVariable id: Long) {
        bodyWeightMeasureService.deleteBodyWeightMeasure(id)
    }
}