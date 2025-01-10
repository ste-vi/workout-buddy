package com.stevi.workoutbuddy.domain.workouttemplate.model.response

import com.stevi.workoutbuddy.domain.exercises.model.response.ExerciseResponse
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.entity.ExerciseInstance
import com.stevi.workoutbuddy.entity.WorkoutTemplate

data class WorkoutTemplateResponse(
    val id: Long,
    val title: String,
    val totalSets: Short = 0,
    val archived: Boolean = false,
    val tags: List<TagResponse>,
    val exercises: List<ExerciseResponse> = emptyList()
) {
    companion object {
        fun fromEntity(entity: WorkoutTemplate, exerciseInstances: List<ExerciseInstance>): WorkoutTemplateResponse {
            return WorkoutTemplateResponse(
                id = entity.id,
                title = entity.title,
                totalSets = entity.totalSets,
                archived = entity.archived,
                tags = entity.tags.map { TagResponse.fromEntity(it) },
                exercises = exerciseInstances.map { ExerciseResponse.fromExerciseInstance(it) }
            )
        }
    }
}