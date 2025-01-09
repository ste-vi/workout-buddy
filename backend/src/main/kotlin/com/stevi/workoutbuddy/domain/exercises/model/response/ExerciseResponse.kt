package com.stevi.workoutbuddy.domain.exercises.model.response

import com.stevi.workoutbuddy.domain.sets.model.response.SetsResponse
import com.stevi.workoutbuddy.entity.Exercise
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory

data class ExerciseResponse(
    val id: Long,
    val name: String,
    val bodyPart: BodyPart,
    val category: ExerciseCategory,
    var sets: List<SetsResponse> = emptyList()
) {
    companion object {
        fun fromEntity(exercise: Exercise): ExerciseResponse {
            return ExerciseResponse(
                id = exercise.id,
                name = exercise.name,
                bodyPart = exercise.bodyPart,
                category = exercise.category,
                sets = exercise.sets.map { SetsResponse.fromEntity(it) }
            )
        }
    }
}