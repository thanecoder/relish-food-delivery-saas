package com.relish.auth;

/**
 * Returned rather than thrown, deliberately. Throwing from inside the transaction rolls back the
 * failed-attempt counter along with it, which is exactly how the attempt cap ended up doing nothing.
 */
enum OtpVerifyResult {
	VALID,
	WRONG_CODE,
	EXPIRED,
	TOO_MANY_ATTEMPTS
}
