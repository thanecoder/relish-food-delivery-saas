package com.relish.account;

import com.relish.user.User;
import com.relish.user.UserService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/account")
class AccountController {

	private final AccountService accountService;
	private final UserService userService;

	AccountController(AccountService accountService, UserService userService) {
		this.accountService = accountService;
		this.userService = userService;
	}

	@GetMapping
	ResponseEntity<AccountResponse> me(@AuthenticationPrincipal Jwt jwt) {
		User user = userService.getById(UUID.fromString(jwt.getSubject()));
		return ResponseEntity.ok(AccountResponse.from(user));
	}

	@DeleteMapping
	ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal Jwt jwt) {
		accountService.deleteAccount(UUID.fromString(jwt.getSubject()));
		return ResponseEntity.noContent().build();
	}

}
