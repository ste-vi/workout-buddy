package com.stevi.workoutbuddy.domain.workouttemplate.model.response

import com.stevi.workoutbuddy.domain.exercises.model.response.ExerciseResponse
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.entity.WorkoutTemplate

data class WorkoutTemplateResponse(
    val id: Long,
    val title: String,
    val estimatedDuration: Short,
    val totalSets: Short = 0,
    val tags: List<TagResponse>,
    val exercises: List<ExerciseResponse> = emptyList()
) {
    companion object {
        fun fromEntity(entity: WorkoutTemplate): WorkoutTemplateResponse {
            return WorkoutTemplateResponse(
                id = entity.id,
                title = entity.title,
                estimatedDuration = entity.estimatedDuration,
                totalSets = entity.totalSets,
                tags = entity.tags.map { TagResponse.fromEntity(it) },
                exercises = entity.exercises.map { ExerciseResponse.fromEntity(it) }
            )
        }
    }
}