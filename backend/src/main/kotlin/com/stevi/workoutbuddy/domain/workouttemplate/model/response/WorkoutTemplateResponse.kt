package com.stevi.workoutbuddy.domain.workouttemplate.model.response

import com.stevi.workoutbuddy.domain.exercises.model.response.ExerciseResponse
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.domain.workout.model.response.LastPerformedWorkout
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.entity.WorkoutTemplate
import com.stevi.workoutbuddy.repository.projection.PrSetProjection

data class WorkoutTemplateResponse(
    val id: Long,
    val title: String,
    val totalSets: Short = 0,
    val archived: Boolean = false,
    val tags: List<TagResponse>,
    val exercises: List<ExerciseResponse> = emptyList(),
    val lastPerformedWorkout: LastPerformedWorkout?
) {
    companion object {
        fun fromEntity(
            entity: WorkoutTemplate,
            exerciseInstances: List<ExerciseInstance>,
            prSetForExerciseMap: Map<Long, PrSetProjection>,
            lastPerformedWorkout: LastPerformedWorkout?
        ): WorkoutTemplateResponse {
            return WorkoutTemplateResponse(
                id = entity.id,
                title = entity.title,
                totalSets = entity.totalSets,
                archived = entity.archived,
                tags = entity.tags.map { TagResponse.fromEntity(it) },
                exercises = exerciseInstances.map {
                    ExerciseResponse.fromExerciseInstance(
                        it,
                        prSetForExerciseMap[it.exercise.id]
                    )
                },
                lastPerformedWorkout = lastPerformedWorkout
            )
        }
    }
}