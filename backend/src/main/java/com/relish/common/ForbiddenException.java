package com.relish.common;

/** Refused for a reason the caller is allowed to know about, unlike a bare access denial. */
public class ForbiddenException extends RuntimeException {

	public ForbiddenException(String message) {
		super(message);
	}

}
