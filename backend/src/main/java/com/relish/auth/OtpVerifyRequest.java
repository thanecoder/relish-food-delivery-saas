package com.relish.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// acceptedTerms only matters for a brand new email - existing users just log in
record OtpVerifyRequest(@NotBlank @Email String email, @NotBlank String code, boolean acceptedTerms) {
}
