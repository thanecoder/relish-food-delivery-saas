package com.relish.delivery;

import com.relish.user.User;
import com.relish.user.UserService;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/delivery/assignments")
@PreAuthorize("hasRole('DELIVERY_PARTNER')")
class DeliveryController {

	private final DeliveryService deliveryService;
	private final UserService userService;

	DeliveryController(DeliveryService deliveryService, UserService userService) {
		this.deliveryService = deliveryService;
		this.userService = userService;
	}

	@GetMapping
	List<DeliveryAssignmentResponse> myAssignments(@AuthenticationPrincipal Jwt jwt) {
		return deliveryService.listForPartner(UUID.fromString(jwt.getSubject())).stream()
			.map(DeliveryAssignmentResponse::from).toList();
	}

	@PostMapping("/{id}/picked-up")
	DeliveryAssignmentResponse pickedUp(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
		User partner = userService.getById(UUID.fromString(jwt.getSubject()));
		return DeliveryAssignmentResponse.from(deliveryService.markPickedUp(id, partner));
	}

	@PostMapping("/{id}/delivered")
	DeliveryAssignmentResponse delivered(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
		User partner = userService.getById(UUID.fromString(jwt.getSubject()));
		return DeliveryAssignmentResponse.from(deliveryService.markDelivered(id, partner));
	}

}
