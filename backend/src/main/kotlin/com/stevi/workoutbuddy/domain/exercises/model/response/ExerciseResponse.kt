package com.stevi.workoutbuddy.domain.exercises.model.response

import com.stevi.workoutbuddy.domain.sets.model.response.SetsResponse
import com.stevi.workoutbuddy.entity.Exercise
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory

data class ExerciseResponse(
    val id: Long,
    val name: String,
    val bodyPart: BodyPart,
    val category: ExerciseCategory,
    var sets: List<SetsResponse> = emptyList(),
    var position: Short?
) {
    companion object {
        fun fromEntity(entity: Exercise): ExerciseResponse {
            return ExerciseResponse(
                id = entity.id,
                name = entity.name,
                bodyPart = entity.bodyPart,
                category = entity.category,
                position = null
            )
        }

        fun fromExerciseInstance(instance: ExerciseInstance): ExerciseResponse {
            instance.exercise
            return ExerciseResponse(
                id = instance.exercise.id,
                name = instance.exercise.name,
                bodyPart = instance.exercise.bodyPart,
                category = instance.exercise.category,
                position = instance.position,
                sets = instance.sets.map { SetsResponse.fromEntity(it) }
            )
        }
    }
}