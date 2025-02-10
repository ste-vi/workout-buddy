package com.stevi.workoutbuddy.domain.tag.service

import com.stevi.workoutbuddy.domain.tag.model.request.TagRequest
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.domain.user.service.UserService
import com.stevi.workoutbuddy.entity.Tag
import com.stevi.workoutbuddy.repository.TagRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TagService(
    private val tagRepository: TagRepository,
    private val userService: UserService
) {

    @Transactional
    fun getTagsOrCreate(tagRequests: List<TagRequest>): List<Tag> {
        val user = userService.getCurrentUser()

        val tagNames = tagRequests.map { it.name }
        val existingTags = tagRepository.findAllByNameInAndUserId(tagNames, user.id)
        val existingTagMap = existingTags.associateBy { it.name }

        val tagsToCreate = tagNames.filter { it !in existingTagMap.keys }
        val newTags = tagsToCreate.map { Tag(name = it, user = user) }
        val savedNewTags = tagRepository.saveAll(newTags)

        return tagNames.map { name ->
            existingTagMap[name] ?: savedNewTags.find { it.name == name }!!
        }
    }

    @Transactional(readOnly = true)
    fun getAllTags(userId: Long): List<TagResponse> {
        return tagRepository.findAllByUserIdOrderByCreatedAtDesc(userId).map { TagResponse.fromEntity(it) }
    }

    @Transactional(readOnly = true)
    fun getTagsForWorkouts(workoutIds: List<Long>): Map<Long, List<Tag>> {
        val projections = tagRepository.findTagsForWorkoutIdIn(workoutIds)
        return projections.groupBy({ it.workoutId }, { it.tag })
    }
}