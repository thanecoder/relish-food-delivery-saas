package com.relish;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// boots against the real db container, not testcontainers - simpler and thats how it actually runs anyway
@SpringBootTest
class RelishApplicationTests {

	@Test
	void contextLoads() {
	}

}
