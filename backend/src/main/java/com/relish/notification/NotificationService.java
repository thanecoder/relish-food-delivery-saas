package com.relish.notification;

import com.relish.user.User;
import java.util.List;
import java.util.UUID;

public interface NotificationService {

	List<Notification> listForUser(UUID userId);

	Notification create(User user, String type, String payload);

	Notification markRead(UUID id);

}
