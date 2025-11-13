import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.hilt)
    id("kotlin-kapt")
}

android {
    namespace = "org.vander.spotifyclient"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    defaultConfig {
        minSdk = libs.versions.android.minSdk.get().toInt()

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")

        val spotifyClientSecret = gradle.extra["spotifyClientSecret"] as String
        val spotifyClientId = gradle.extra["spotifyClientId"] as String
        buildConfigField("String", "CLIENT_SECRET", "\"$spotifyClientSecret\"")
        buildConfigField("String", "CLIENT_ID", "\"$spotifyClientId\"")

        manifestPlaceholders["redirectSchemeName"] = "org-vander-androidapp"
        manifestPlaceholders["redirectHostName"] = "callback"


    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlin {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_17)
        }
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = libs.versions.compose.compiler.get()
    }
}

dependencies {

    // --- Projects
    implementation(project(":packages:core-domain"))
    implementation(project(":packages:core-dto"))
    implementation(project(":packages:core-ui"))

    // --- KotlinX
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.androidx.fragment.ktx)

    // --- AndroidX Core
    implementation(libs.androidx.core.ktx)

    // --- Lifecycle
    implementation(libs.lifecycle.runtime.ktx)
    implementation(libs.lifecycle.viewmodel.ktx)
    implementation(libs.lifecycle.runtime.compose)

    // --- Navigation
    implementation(libs.navigation.compose)

    // --- Compose (via BOM)
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    debugImplementation(libs.compose.ui.tooling)

    // Material 3 + Adaptive
    implementation(libs.compose.material3)
    implementation(libs.compose.material.icons.ext)

    // Activity Compose
    implementation(libs.activity.compose)

    // --- Hilt
    implementation(libs.hilt.android)
    kapt(libs.hilt.compiler)
    // si nécessaire :
    // kapt(libs.androidx.hilt.compiler)

    // --- Spotify SDK (provided by consumer apps)
    // Use compileOnly here to avoid bundling local AARs into this AAR (AGP restriction)
    compileOnly(files("libs/spotify-app-remote-release-0.8.0.aar"))
    compileOnly(files("libs/spotify-auth-release-2.1.0.aar"))

    // --- AndroidX Utils
    implementation(libs.androidx.browser)

    // --- Ktor
    implementation(libs.ktor.client.core)
    implementation(libs.ktor.client.okhttp)
    implementation(libs.ktor.client.content.negotiation)
    implementation(libs.ktor.client.logging)
    implementation(libs.ktor.serialization.kotlinx.json)

    // --- DataStore
    implementation(libs.datastore.preferences)

    // --- Gson
    implementation(libs.gson)

    // --- Coil (images)
    implementation(libs.coil.compose)

    // --- Tests
    testImplementation(libs.junit4)
    androidTestImplementation(libs.androidx.test.ext.junit)
    androidTestImplementation(libs.espresso.core)
    androidTestImplementation(platform(libs.compose.bom))
    androidTestImplementation(libs.compose.ui.test.junit4)
    debugImplementation(libs.compose.ui.test.manifest)

}
