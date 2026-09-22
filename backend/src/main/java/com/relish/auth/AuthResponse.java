package com.relish.auth;

record AuthResponse(String accessToken, long expiresIn, String email, String name, String role) {
}
