package com.relish.auth;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

// in memory is fine here, single instance, no need for redis or whatever
@Component
class RateLimiter {

	private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

	boolean tryConsume(String key, int capacity, Duration period) {
		Bucket bucket = buckets.computeIfAbsent(key, k -> Bucket.builder()
			.addLimit(Bandwidth.classic(capacity, Refill.intervally(capacity, period)))
			.build());
		return bucket.tryConsume(1);
	}

}
