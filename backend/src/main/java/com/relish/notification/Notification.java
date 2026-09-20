package com.relish.notification;

import com.relish.common.BaseEntity;
import com.relish.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "notifications")
public class Notification extends BaseEntity {

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private String type;

	@Column(length = 2000)
	private String payload;

	private Instant readAt;

	protected Notification() {
	}

	public Notification(User user, String type, String payload) {
		this.user = user;
		this.type = type;
		this.payload = payload;
	}

	public User getUser() {
		return user;
	}

	public String getType() {
		return type;
	}

	public String getPayload() {
		return payload;
	}

	public Instant getReadAt() {
		return readAt;
	}

	public void markRead() {
		this.readAt = Instant.now();
	}

}
