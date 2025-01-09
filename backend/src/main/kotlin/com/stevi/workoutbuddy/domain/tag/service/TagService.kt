package com.stevi.workoutbuddy.domain.tag.service

import com.stevi.workoutbuddy.domain.tag.model.request.TagRequest
import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.entity.Tag
import com.stevi.workoutbuddy.repository.TagRepository
import com.stevi.workoutbuddy.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TagService(
    private val tagRepository: TagRepository,
    private val userRepository: UserRepository
) {

    @Transactional
    fun getTagsOrCreate(tagRequests: List<TagRequest>, userId: Long): List<Tag> {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User not found with id: $userId") }

        val tagNames = tagRequests.map { it.name }
        val existingTags = tagRepository.findAllByNameInAndUserId(tagNames, userId)
        val existingTagNames = existingTags.map { it.name }.toSet()

        val newTags = (tagNames - existingTagNames).map { Tag(name = it, user = user) }
        val savedNewTags = tagRepository.saveAll(newTags)

        return existingTags + savedNewTags
    }

    @Transactional(readOnly = true)
    fun getAllTags(userId: Long): List<TagResponse> {
        return tagRepository.findAllByUserIdOrderByCreatedAtDesc(userId).map { TagResponse.fromEntity(it) }
    }
}