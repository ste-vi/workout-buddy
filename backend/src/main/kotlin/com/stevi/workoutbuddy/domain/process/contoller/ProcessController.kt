package com.stevi.workoutbuddy.domain.process.contoller

import com.stevi.workoutbuddy.domain.user.model.response.OngoingProcess
import com.stevi.workoutbuddy.domain.process.service.ProcessService
import com.stevi.workoutbuddy.security.SecurityUtil
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/processes")
class ProcessController(val processService: ProcessService) {

    @GetMapping("/ongoing")
    @ResponseStatus(HttpStatus.OK)
    fun findOngoingProcess(): OngoingProcess? {
       return processService.findOngoingProcess(SecurityUtil.getCurrentUserId())
    }
}