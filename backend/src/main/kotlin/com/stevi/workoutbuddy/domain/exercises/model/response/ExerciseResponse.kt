package com.stevi.workoutbuddy.domain.exercises.model.response

import com.stevi.workoutbuddy.domain.sets.model.response.SetsResponse
import com.stevi.workoutbuddy.entity.Exercise
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.enumeration.BodyPart
import com.stevi.workoutbuddy.enumeration.ExerciseCategory
import com.stevi.workoutbuddy.repository.projection.PrSetProjection
import com.stevi.workoutbuddy.repository.projection.SetProjection

data class ExerciseResponse(
    val id: Long,
    val name: String,
    val bodyPart: BodyPart,
    val category: ExerciseCategory,
    var sets: List<SetsResponse> = emptyList(),
    var prSet: SetsResponse?,
    var position: Short?
) {
    companion object {
        fun fromEntity(entity: Exercise, prSet: PrSetProjection?): ExerciseResponse {
            return ExerciseResponse(
                id = entity.id,
                name = entity.name,
                bodyPart = entity.bodyPart,
                category = entity.category,
                position = null,
                prSet = prSet?.let { SetsResponse.fromPrSetProjection(it) },
            )
        }

        fun fromExerciseInstance(
            instance: ExerciseInstance,
            sets: List<SetProjection>,
            prSet: PrSetProjection?
        ): ExerciseResponse {
            return ExerciseResponse(
                id = instance.exercise.id,
                name = instance.exercise.name,
                bodyPart = instance.exercise.bodyPart,
                category = instance.exercise.category,
                position = instance.position,
                sets = sets.map { SetsResponse.fromProjection(it) },
                prSet = prSet?.let { SetsResponse.fromPrSetProjection(it) },
            )
        }
    }
}