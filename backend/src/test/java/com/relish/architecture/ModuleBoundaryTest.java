package com.relish.architecture;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.library.dependencies.SlicesRuleDefinition;

// keeps modules from reaching into each others repositories, catches it if someone forgets
@AnalyzeClasses(packages = "com.relish", importOptions = ImportOption.DoNotIncludeTests.class)
class ModuleBoundaryTest {

	@ArchTest
	static final ArchRule repositories_are_never_public =
		classes().that().haveSimpleNameEndingWith("Repository")
			.and().resideInAPackage("com.relish..")
			.should().notBePublic()
			.because("other packages must go through a module's public *Service interface, never its repository");

	@ArchTest
	static final ArchRule service_implementations_are_never_public =
		classes().that().haveSimpleNameEndingWith("ServiceImpl")
			.and().resideInAPackage("com.relish..")
			.should().notBePublic()
			.because("the *Service interface is the module's public contract, not its implementation");

	@ArchTest
	static final ArchRule feature_packages_are_free_of_cycles =
		SlicesRuleDefinition.slices().matching("com.relish.(*)..")
			.should().beFreeOfCycles();

}
