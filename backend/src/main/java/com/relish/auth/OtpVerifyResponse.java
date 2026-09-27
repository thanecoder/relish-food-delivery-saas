package com.relish.auth;

/**
 * A correct code means one of two things: theres an account waiting, or theres an inbox we can now
 * trust enough to offer one. The client branches on outcome; only one of the two fields is ever set.
 */
record OtpVerifyResponse(String outcome, AuthResponse session, String registrationToken, long expiresIn) {

	static final String SESSION = "SESSION";
	static final String REGISTRATION_REQUIRED = "REGISTRATION_REQUIRED";

	static OtpVerifyResponse session(AuthResponse session) {
		return new OtpVerifyResponse(SESSION, session, null, 0);
	}

	static OtpVerifyResponse registrationRequired(String registrationToken, long expiresIn) {
		return new OtpVerifyResponse(REGISTRATION_REQUIRED, null, registrationToken, expiresIn);
	}

}
