package com.relish.common;

/** An operation was rejected because of the entity's current state (e.g. an invalid order-status transition). */
public class ConflictException extends RuntimeException {

	public ConflictException(String message) {
		super(message);
	}

}
