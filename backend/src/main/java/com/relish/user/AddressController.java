package com.relish.user;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/addresses")
class AddressController {

	private final AddressService addressService;
	private final UserService userService;

	AddressController(AddressService addressService, UserService userService) {
		this.addressService = addressService;
		this.userService = userService;
	}

	@GetMapping
	List<AddressResponse> list(@AuthenticationPrincipal Jwt jwt) {
		return addressService.listForUser(UUID.fromString(jwt.getSubject())).stream()
			.map(AddressResponse::from).toList();
	}

	@PostMapping
	ResponseEntity<AddressResponse> add(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody AddressRequest request) {
		User user = userService.getById(UUID.fromString(jwt.getSubject()));
		Address address = addressService.add(user, request.label(), request.line1(), request.line2(),
			request.city(), request.isDefault());
		return ResponseEntity.ok(AddressResponse.from(address));
	}

}
