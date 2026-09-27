package com.relish.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

record OtpVerifyRequest(@NotBlank @Email String email, @NotBlank String code) {
}
