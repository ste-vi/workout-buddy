package com.stevi.workoutbuddy

import java.util.*
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class WorkoutBuddyApplication

fun main(args: Array<String>) {
	TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
	runApplication<WorkoutBuddyApplication>(*args)
}
