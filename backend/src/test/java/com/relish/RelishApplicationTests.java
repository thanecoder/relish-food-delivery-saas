package com.relish;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Boots the real application context against the Compose-managed {@code db} service (not
 * Testcontainers — see {@link TestcontainersConfiguration} for that alternative). This mirrors
 * how the app actually runs: it's always Compose, never an ad-hoc database, in this project.
 * Testcontainers' own sibling-container networking also doesn't resolve cleanly when the JVM
 * itself is running inside a container on Docker Desktop, so this avoids that entirely.
 */
@SpringBootTest
class RelishApplicationTests {

	@Test
	void contextLoads() {
	}

}
