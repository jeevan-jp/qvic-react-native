## Release to production
in android/app/build.gradle, comment build line and uncomment release one.

```
  release {
      // Caution! In production, you need to generate your own keystore file.
      // see https://facebook.github.io/react-native/docs/signed-apk-android.
      // signingConfig signingConfigs.debug
      signingConfig signingConfigs.release
      minifyEnabled enableProguardInReleaseBuilds
      proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
  }
  
```