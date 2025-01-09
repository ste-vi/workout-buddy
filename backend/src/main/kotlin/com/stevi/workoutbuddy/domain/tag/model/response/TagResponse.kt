package com.stevi.workoutbuddy.domain.tag.model.response

import com.stevi.workoutbuddy.entity.Tag

data class TagResponse(
    val id: Long,
    val name: String,
) {
    companion object {
        fun fromEntity(entity: Tag): TagResponse {
            return TagResponse(
                id = entity.id,
                name = entity.name,
            )
        }
    }
}