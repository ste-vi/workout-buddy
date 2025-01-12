package com.stevi.workoutbuddy.domain.sets.service

import com.stevi.workoutbuddy.domain.sets.model.request.SetsRequest
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.entity.Sets
import com.stevi.workoutbuddy.exception.ResourceNotFoundException
import com.stevi.workoutbuddy.repository.SetsRepository
import java.time.LocalDateTime
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SetsService(private val setsRepository: SetsRepository) {


    @Transactional
    fun addSet(exerciseInstance: ExerciseInstance, setsRequest: SetsRequest): Sets {
        val newSet = Sets(
            weight = null,
            reps = null,
            completed = false,
            completedAt = null,
            exerciseInstance = exerciseInstance
        )
        return setsRepository.save(newSet)
    }

    @Transactional
    fun deleteSet(setId: Long) {
        val set = setsRepository.findById(setId)
            .orElseThrow { ResourceNotFoundException("Set not found in the workout") }
        setsRepository.delete(set)
    }

    @Transactional
    fun updateSet(setId: Long, exerciseId: Long, weight: Double?, reps: Short?) {
        val set = getExercise(setId, exerciseId)

        weight?.let { set.weight = it }
        reps?.let { set.reps = it }

        setsRepository.save(set)
    }

    @Transactional
    fun completeSet(setId: Long, exerciseId: Long) {
        val set = getExercise(setId, exerciseId)

        set.completed = true
        set.completedAt = LocalDateTime.now()
        setsRepository.save(set)
    }

    private fun getExercise(setId: Long, exerciseId: Long): Sets {
        return setsRepository.findByIdAndExerciseInstanceExerciseId(setId, exerciseId)
            ?: throw ResourceNotFoundException("Set not found in the workout")
    }
}