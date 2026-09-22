package com.relish.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

record OtpRequestRequest(@NotBlank @Email String email) {
}
