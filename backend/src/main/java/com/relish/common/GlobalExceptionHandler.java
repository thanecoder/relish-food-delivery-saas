package com.relish.common;

import jakarta.validation.ConstraintViolationException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(NotFoundException.class)
	ResponseEntity<ApiError> handleNotFound(NotFoundException ex) {
		return respond(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(ConflictException.class)
	ResponseEntity<ApiError> handleConflict(ConflictException ex) {
		return respond(HttpStatus.CONFLICT, ex.getMessage());
	}

	@ExceptionHandler({ BadCredentialsException.class, AccessDeniedException.class })
	ResponseEntity<ApiError> handleAuth(RuntimeException ex) {
		return respond(HttpStatus.FORBIDDEN, "Not authorized to perform this action.");
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
		List<String> details = ex.getBindingResult().getFieldErrors().stream()
			.map(f -> f.getField() + ": " + f.getDefaultMessage())
			.toList();
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(ApiError.of(400, "Validation Failed", "One or more fields are invalid.", details));
	}

	@ExceptionHandler(ConstraintViolationException.class)
	ResponseEntity<ApiError> handleConstraintViolation(ConstraintViolationException ex) {
		return respond(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<ApiError> handleUnexpected(Exception ex) {
		log.error("Unhandled exception", ex);
		return respond(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong. Please try again.");
	}

	private ResponseEntity<ApiError> respond(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(ApiError.of(status.value(), status.getReasonPhrase(), message));
	}

}
