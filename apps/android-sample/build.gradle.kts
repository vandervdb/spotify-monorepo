import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.hilt)
    id("kotlin-kapt")
}

android {
    namespace = "org.vander.android.sample"
    compileSdk = libs.versions.android.compileSdk.get().toInt()

    defaultConfig {
        applicationId = "org.vander.android.sample"
        minSdk = libs.versions.android.minSdk.get().toInt()
        targetSdk = libs.versions.android.targetSdk.get().toInt()
        versionCode = libs.versions.android.versionCode.get().toInt()
        versionName = libs.versions.android.versionName.get()

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        manifestPlaceholders["redirectSchemeName"] = "org-vander-androidapp"
        manifestPlaceholders["redirectHostName"] = "callback"

    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
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

    dexOptions {
        javaMaxHeapSize = "2g"
    }

}


dependencies {

    // --- Modules internes
    implementation(project(":android-lib"))

    // --- Spotify SDK AARs (required at app level)
    implementation(files("../../android-lib/libs/spotify-app-remote-release-0.8.0.aar"))
    implementation(files("../../android-lib/libs/spotify-auth-release-2.1.0.aar"))
    implementation(project(":packages:fake"))
    implementation(project(":packages:core-ui"))
    implementation(project(":packages:core-domain"))

    // --- Add required runtime deps for Spotify SDK mappers and logging
    implementation("com.fasterxml.jackson.core:jackson-databind:2.16.2")
    implementation("org.slf4j:slf4j-android:1.7.36")

    // --- AndroidX - Core & Lifecycle (catalog)
    implementation(libs.androidx.core.ktx)
    implementation(libs.lifecycle.runtime.ktx)
    implementation(libs.lifecycle.viewmodel.ktx)
    implementation(libs.lifecycle.runtime.compose)

    // --- Compose (via BOM) (catalog)
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.tooling.preview)
    debugImplementation(libs.compose.ui.tooling)

    // Activity Compose (catalog)
    implementation(libs.activity.compose)

    // Material 3 + Icons + Adaptive (catalog)
    implementation(libs.material)
    implementation(libs.compose.material3)
    implementation(libs.compose.material.icons.ext)
    implementation(libs.androidx.material3.window.size)


    // --- Coil (catalog)
    implementation(libs.coil.compose)

    // --- Gson (catalog)
    implementation(libs.gson)

    // --- Hilt (catalog)
    implementation(libs.hilt.android)
    kapt(libs.hilt.compiler)
    kapt(libs.hilt.android)
    kapt(libs.androidx.hilt.compiler) // pour @HiltViewModel uniquement
//    implementation(libs.hilt.navigation.compose)
    implementation(libs.hilt.navigation.compose)


    // --- Tests (catalog)
    testImplementation(libs.junit4)
    androidTestImplementation(libs.androidx.test.ext.junit)
    androidTestImplementation(libs.espresso.core)
    androidTestImplementation(platform(libs.compose.bom))
    androidTestImplementation(libs.compose.ui.test.junit4)
    debugImplementation(libs.compose.ui.test.manifest)
}
