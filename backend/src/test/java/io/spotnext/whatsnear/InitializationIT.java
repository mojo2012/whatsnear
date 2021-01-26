package io.spotnext.whatsnear;

import static org.junit.Assert.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import io.spotnext.core.CoreInit;
import io.spotnext.core.testing.AbstractIntegrationTest;
import io.spotnext.core.testing.IntegrationTest;
import io.spotnext.instrumentation.DynamicInstrumentationLoader;

/**
 * This integration test checks if the module has been initialized properly.
 */
@IntegrationTest(initClass = Init.class)
@SpringBootTest(classes = { Init.class, CoreInit.class })
public class InitializationIT extends AbstractIntegrationTest {

	@Autowired
	Init init;

	@Override
	protected void prepareTest() {
		//
	}

	@Override
	protected void teardownTest() {
		//
	}

	@Test
	public void moduleInitialized() {
		assertTrue(Init.class.getSimpleName() + " not initialized", init.isAlreadyInitialized());
		assertTrue("Instrumentation not initiazed", DynamicInstrumentationLoader.isInstrumentationAvailable());
	}

}
