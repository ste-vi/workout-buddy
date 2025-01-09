package com.stevi.workoutbuddy.domain.tag.controller

import com.stevi.workoutbuddy.domain.tag.model.response.TagResponse
import com.stevi.workoutbuddy.domain.tag.service.TagService
import com.stevi.workoutbuddy.security.SecurityUtil
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/tags")
class TagController(private val tagService: TagService) {

    @GetMapping
    fun getAllTags(): List<TagResponse> {
        return tagService.getAllTags(SecurityUtil.getCurrentUserId())
    }
}