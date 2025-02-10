package com.stevi.workoutbuddy.domain.weight.service

import com.stevi.workoutbuddy.common.model.response.PageResponse
import com.stevi.workoutbuddy.domain.weight.model.request.BodyWeightMeasureRequest
import com.stevi.workoutbuddy.domain.weight.model.response.BodyWeightMeasureResponse
import com.stevi.workoutbuddy.domain.user.service.UserService
import com.stevi.workoutbuddy.entity.BodyWeightMeasure
import com.stevi.workoutbuddy.repository.BodyWeightMeasureRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class BodyWeightMeasureService(
    private val bodyWeightMeasureRepository: BodyWeightMeasureRepository,
    private val userService: UserService
) {

    @Transactional
    fun addBodyWeightMeasure(request: BodyWeightMeasureRequest): BodyWeightMeasureResponse {
        val bodyWeightMeasure = BodyWeightMeasure(
            weight = request.value,
            date = request.date,
            user = userService.getCurrentUser()
        )
        val savedMeasure = bodyWeightMeasureRepository.save(bodyWeightMeasure)
        return BodyWeightMeasureResponse.fromEntity(savedMeasure)
    }

    @Transactional(readOnly = true)
    fun getLastNBodyWeightMeasuresForUser(userId: Long, size: Int): List<BodyWeightMeasureResponse> {
        return bodyWeightMeasureRepository.findByUserIdOrderByDateDesc(userId, Pageable.ofSize(size))
            .map { BodyWeightMeasureResponse.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun searchBodyWeightMeasures(
        userId: Long,
        page: Int,
        size: Int,
        sortOrder: String
    ): PageResponse<BodyWeightMeasureResponse> {
        val sort = Sort.by(if (sortOrder.equals("asc", ignoreCase = true)) Sort.Direction.ASC else Sort.Direction.DESC, "date")
        val pageable = PageRequest.of(page, size, sort)

        val measures = bodyWeightMeasureRepository.findByUserId(
            userId,
            pageable
        )

        return PageResponse(
            content = measures.content.map { BodyWeightMeasureResponse.fromEntity(it) },
            pageNumber = measures.number,
            pageSize = measures.size,
            totalPages = measures.totalPages,
            totalElements = measures.totalElements,
            last = measures.isLast
        )
    }

    @Transactional
    fun updateBodyWeightMeasure(id: Long, request: BodyWeightMeasureRequest): BodyWeightMeasureResponse {
        val existingMeasure = bodyWeightMeasureRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Body weight measure not found") }

        existingMeasure.weight = request.value
        existingMeasure.date = request.date

        val updatedMeasure = bodyWeightMeasureRepository.save(existingMeasure)
        return BodyWeightMeasureResponse.fromEntity(updatedMeasure)
    }

    @Transactional
    fun deleteBodyWeightMeasure(id: Long) {
        bodyWeightMeasureRepository.deleteById(id)
    }
}