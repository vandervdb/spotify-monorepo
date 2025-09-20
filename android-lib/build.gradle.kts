plugins {
    id("com.android.library")
    kotlin("android")
    `maven-publish`
}

    android {
    namespace = "org.vander.spotifyclient"
    compileSdk = 36

    defaultConfig {
    minSdk = 24

      testInstrumentationRunner = "android.support.test.runner.AndroidJUnitRunner"
      consumerProguardFiles("consumer-rules.pro")
    }

    buildTypes {
       release {
           isMinifyEnabled = false
           proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
       }
    }
    }

  dependencies {

  }
