plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
}

group = "org.vander.core"
version = rootProject.findProperty("VERSION_NAME") ?: "0.1.0-SNAPSHOT"

android {
    namespace = "org.vander.core.ui"

     compileSdk = libs.versions.android.compileSdk.get().toInt()


    defaultConfig {
         minSdk = libs.versions.android.minSdk.get().toInt()

        consumerProguardFiles("consumer-rules.pro")
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        buildConfig = false
         compose = false
    }

    // composeOptions {
    //     kotlinCompilerExtensionVersion = libs.versions.androidx.compose.compiler.get()
    // }
}

kotlin {
    jvmToolchain(17)

    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
    }
}

dependencies {
    api(libs.kotlinx.coroutines.core)

    implementation(project(":packages:core-domain"))

     implementation(libs.androidx.core.ktx)
}
