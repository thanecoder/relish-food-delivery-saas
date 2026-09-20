package com.relish.common;

import java.time.Instant;
import java.util.List;

/** Uniform error shape returned by every endpoint, so the frontend has exactly one shape to render. */
public record ApiError(Instant timestamp, int status, String error, String message, List<String> details) {

	public static ApiError of(int status, String error, String message) {
		return new ApiError(Instant.now(), status, error, message, List.of());
	}

	public static ApiError of(int status, String error, String message, List<String> details) {
		return new ApiError(Instant.now(), status, error, message, details);
	}

}
