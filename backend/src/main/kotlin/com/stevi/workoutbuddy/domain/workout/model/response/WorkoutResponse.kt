package com.stevi.workoutbuddy.domain.workout.model.response

import com.stevi.workoutbuddy.domain.exercises.model.response.ExerciseResponse
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.entity.Workout
import com.stevi.workoutbuddy.entity.WorkoutTemplate
import java.time.LocalDateTime

data class WorkoutResponse(
    val id: Long,
    val title: String,
    val prReps: Short = 0,
    val totalWeight: Short = 0,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime?,
    val tags: List<TagResponse>,
    val exercises: List<ExerciseResponse> = emptyList()
) {
    companion object {
        fun fromEntity(entity: Workout, exerciseInstances: List<ExerciseInstance>): WorkoutResponse {
            return WorkoutResponse(
                id = entity.id,
                title = entity.title,
                prReps = entity.prReps,
                totalWeight = entity.totalWeight,
                startTime = entity.createdAt,
                endTime = entity.endTime,
                tags = entity.tags.map { TagResponse.fromEntity(it) },
                exercises = exerciseInstances.map { ExerciseResponse.fromExerciseInstance(it) }
            )
        }
    }
}