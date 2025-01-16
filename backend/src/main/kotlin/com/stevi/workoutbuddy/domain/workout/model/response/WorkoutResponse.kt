package com.stevi.workoutbuddy.domain.workout.model.response

import com.stevi.workoutbuddy.domain.exercises.model.response.ExerciseResponse
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.entity.Tag
import com.stevi.workoutbuddy.entity.Workout
import com.stevi.workoutbuddy.repository.projection.PrSetProjection
import com.stevi.workoutbuddy.repository.projection.SetProjection
import java.time.LocalDateTime

data class WorkoutResponse(
    val id: Long,
    val title: String,
    val totalWeight: Double?,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime?,
    val tags: List<TagResponse>,
    val exercises: List<ExerciseResponse> = emptyList()
) {
    companion object {
        fun fromEntity(
            entity: Workout,
            exerciseInstances: List<ExerciseInstance>,
            sets: List<SetProjection>,
            prSetForExerciseMap: Map<Long, PrSetProjection>
        ): WorkoutResponse {
            return WorkoutResponse(
                id = entity.id,
                title = entity.title,
                totalWeight = entity.totalWeight,
                startTime = entity.createdAt,
                endTime = entity.endAt,
                tags = entity.tags.map { TagResponse.fromEntity(it) },
                exercises = exerciseInstances.map {
                    ExerciseResponse.fromExerciseInstance(
                        it,
                        sets.filter { s -> s.exerciseId == it.exercise.id },
                        prSetForExerciseMap[it.exercise.id]
                    )
                }
            )
        }

        fun fromEntity(
            entity: Workout,
            tags: List<Tag>,
            exerciseInstances: List<ExerciseInstance>,
            sets: List<SetProjection>,
            prSetForExerciseMap: Map<Long, PrSetProjection>
        ): WorkoutResponse {
            return WorkoutResponse(
                id = entity.id,
                title = entity.title,
                totalWeight = entity.totalWeight,
                startTime = entity.createdAt,
                endTime = entity.endAt,
                tags = tags.map { TagResponse.fromEntity(it) },
                exercises = exerciseInstances.map {
                    ExerciseResponse.fromExerciseInstance(
                        it,
                        sets.filter { s -> s.exerciseId == it.exercise.id },
                        prSetForExerciseMap[it.exercise.id]
                    )
                }
            )
        }
    }
}