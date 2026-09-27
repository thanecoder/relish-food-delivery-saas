package com.relish.notification;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface NotificationRepository extends JpaRepository<Notification, UUID> {

	List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId);

	void deleteByUserId(UUID userId);

}
