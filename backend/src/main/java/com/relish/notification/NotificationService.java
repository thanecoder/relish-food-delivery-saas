package com.relish.notification;

import com.relish.user.User;
import java.util.List;
import java.util.UUID;

/** The only way another package may read or write notification data — never through {@link NotificationRepository} directly. */
public interface NotificationService {

	List<Notification> listForUser(UUID userId);

	Notification create(User user, String type, String payload);

	Notification markRead(UUID id);

}
