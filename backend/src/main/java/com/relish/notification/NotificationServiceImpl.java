package com.relish.notification;

import com.relish.common.NotFoundException;
import com.relish.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
class NotificationServiceImpl implements NotificationService {

	private final NotificationRepository notificationRepository;

	NotificationServiceImpl(NotificationRepository notificationRepository) {
		this.notificationRepository = notificationRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public List<Notification> listForUser(UUID userId) {
		return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
	}

	@Override
	public Notification create(User user, String type, String payload) {
		return notificationRepository.save(new Notification(user, type, payload));
	}

	@Override
	public Notification markRead(UUID id) {
		Notification notification = notificationRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("No notification with id " + id));
		notification.markRead();
		return notification;
	}

	@Override
	public void deleteAllForUser(UUID userId) {
		notificationRepository.deleteByUserId(userId);
	}

}
