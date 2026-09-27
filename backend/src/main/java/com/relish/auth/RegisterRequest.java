package com.relish.auth;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

record RegisterRequest(@NotBlank String registrationToken,
		@AssertTrue(message = "the terms have to be accepted to create an account") boolean acceptedTerms) {
}
