import org.gradle.api.DefaultTask
import org.gradle.api.provider.ListProperty
import org.gradle.api.file.RegularFileProperty
import org.gradle.api.tasks.*

plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.hilt) apply false
    alias(libs.plugins.android.library) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.kotlin.jvm) apply false
}

abstract class CheckCatalogConsistencyTask : DefaultTask() {

    @get:InputFile
    abstract val tomlFile: RegularFileProperty

    @get:Input
    abstract val allowedUnusedVersionKeys: ListProperty<String>

    @TaskAction
    fun check() {
        println("✅ Checking Version Catalog Consistency...")

        val file = tomlFile.get().asFile
        if (!file.exists()) {
            throw GradleException("📛 Cannot find ${file.path} !")
        }

        val content = file.readText()

        val declaredVersions =
            Regex("""^\s*([a-zA-Z0-9_-]+)\s*=\s*["'][^"']+["']""", RegexOption.MULTILINE)
                .findAll(content.substringAfter("[versions]").substringBefore("["))
                .map { it.groupValues[1] }
                .toSet()

        val usedVersionKeys = Regex("""version(?:\.ref)?\s*=\s*["']([a-zA-Z0-9_-]+)["']""")
            .findAll(content)
            .map { it.groupValues[1] }
            .toSet()

        val allow = allowedUnusedVersionKeys.get().toSet()
        val unused = declaredVersions - usedVersionKeys - allow

        if (unused.isNotEmpty()) {
            println("⚠️  Some versions are not applied in catalog:")
            unused.forEach { println("- $it") }
            throw GradleException("❌ Invalid version catalog: detected ${unused.size} unused version key(s).")
        } else {
            println("✅ Version Catalog is clean! 🎉")
        }
    }
}

tasks.register<CheckCatalogConsistencyTask>("checkCatalogConsistency") {
    group = "verification"
    description = "Checking whether all versions in libs.versions.toml are used."

    tomlFile.set(layout.projectDirectory.file("gradle/libs.versions.toml"))

    // Authorized keys that are nor present un dependecy declaration but are present in libs.versions.toml*
    allowedUnusedVersionKeys.set(
        listOf(
            "android-compileSdk",
            "android-minSdk",
            "android-targetSdk",
            "android-versionCode",
            "android-versionName"
        )
    )
}

abstract class CheckVersionHardcodedUsagesTask : DefaultTask() {

    @get:InputFiles
    @get:PathSensitive(PathSensitivity.RELATIVE)
    abstract val gradleFiles: ConfigurableFileCollection

    @TaskAction
    fun check() {
        println("🔍 Looking for hard-coded dependencies inside dependencies { } blocks...")

        val dependencyBlockRegex = Regex("""(?s)dependencies\s*\{.*?}""")
        // match "group:artifact:version" between quotes
        val hardcodedDependencyRegex = Regex("""["'][^"']+:[^"']+:[^"']+["']""")

        val badUsages = gradleFiles.files.flatMap { file ->
            val content = file.readText()
            val blocks = dependencyBlockRegex.findAll(content)

            blocks.flatMap { match ->
                val block = match.value.lines()
                block.withIndex()
                    .filter { (_, line) ->
                        // ligne qui contient un GAV en dur ET pas de libs.*
                        hardcodedDependencyRegex.containsMatchIn(line) && "libs." !in line
                    }
                    .map { (idx, line) ->
                        "${file.path} [dependencies block] line ${idx + 1} → $line".trim()
                    }
            }
        }

        if (badUsages.isNotEmpty()) {
            println("⚠️  Hard-coded dependencies detected:")
            badUsages.forEach { println(it) }
            throw GradleException("❌ One or more dependencies do not use the Version Catalog (libs.*).")
        } else {
            println("✅ All dependencies in dependencies { } use the Version Catalog.")
        }
    }
}

tasks.register<CheckVersionHardcodedUsagesTask>("checkVersionHardcodedUsages") {
    group = "verification"
    description = "Verify all dependencies use the Gradle Version Catalog (libs.*)."

    gradleFiles.from(
        layout.projectDirectory.asFileTree.matching {
            include("**/build.gradle.kts", "**/build.gradle")
            exclude("**/rn-modules/**", "**/node_modules/**")
        }
    )
}
