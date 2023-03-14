# That App

**That App** is a mobile app for both platform (iOS & Android), which follow the **react-native-starter** template standard and best practices for react-native project.

© 2020. All Rights Reserved.

## Technology Stack

- React Native
- React Navigation V6
- Redux, @reduxjs/toolkit (State Management)

## Getting Started

Clone the repo and run the following command in the root of the folder to get started

`yarn insall`
or
`npm install`

For android: `yarn react-native run-android` | `npx react-native run-android`

For ios: `yarn react-native run-ios` | `npx react-native run-ios`

## Prerequisites

```sh
- Node, Watchman
- Npx
- Yarn
- Xcode (For iOS)
- Java Development Kit
- Android development environment (For Android)
```

## Built With

- [React Native](https://facebook.github.io/react-native/) - The javascript framework used
- [Yarn](https://yarnpkg.com/) - Dependency Management
- [Npm](https://www.npmjs.com/) - Dependency Management

## Scripts

```sh



"adb": "adb devices",
"yarnResetCache": "yarn start --reset-cache",
"resetCache": "npx react-native start --reset-cache",
"android": "cd android && ./gradlew clean && cd .. && npx react-native run-android",
"rm:bundle:android": "rm android/app/src/main/assets/index.android.bundle",
"build:bundle:android": "npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/",
"gradlewClean": "cd android && ./gradlew clean",
"debugApk": "cd android && ./gradlew assembleDebug",
"bundleRelease:android": "cd android && ./gradlew bundleRelease",
"assembleRelease:android": "cd android && ./gradlew assembleRelease",
"testReleaseBuild:android": "npx react-native run-android --variant=release",
"sim:ios": "npx react-native run-ios",
"pho:ios": "npx react-native run-ios --simulator=\"iPhone 8\"",
"sim:12": "npx react-native run-ios --simulator=\"iPhone 12\"",
"sim:12ProMax": "npx react-native run-ios --simulator=\"iPhone 12 Pro Max\"",
"sim:iPad8Gen": "npx react-native run-ios --simulator=\"iPad (8th generation)\"",
"build:bundle:ios": "npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios",
"postinstall": "patch-package",
"start": "react-native start",
"test": "jest --no-cache -u",
"lint": "eslint ."
```

## dependencies

```sh
"@invertase/react-native-apple-authentication": "^2.1.0",
"@react-native-community/async-storage": "^1.12.1",
"@react-native-community/hooks": "^2.6.0",
"@react-native-community/masked-view": "^0.1.10",
"@react-native-community/netinfo": "^5.9.7",
"@react-native-community/picker": "^1.6.6",
"@react-native-firebase/analytics": "^12.7.2",
"@react-native-firebase/app": "^12.7.2",
"@react-navigation/bottom-tabs": "^5.9.2",
"@react-navigation/material-top-tabs": "^5.2.19",
"@react-navigation/native": "^5.7.6",
"@react-navigation/stack": "^5.9.3",
"axios": "^0.20.0",
"moment": "^2.29.1",
"react": "16.13.1",
"react-native": "0.63.3",
"react-native-calendars": "^1.403.0",
"react-native-check-version": "^1.0.9",
"react-native-device-info": "^8.4.0",
"react-native-dotenv": "^2.5.3",
"react-native-fbsdk-next": "^4.0.0",
"react-native-flash-message": "^0.1.17",
"react-native-geocoding": "^0.5.0",
"react-native-geolocation-service": "^5.2.0",
"react-native-gesture-handler": "^1.8.0",
"react-native-image-crop-picker": "^0.35.1",
"react-native-image-viewing": "^0.2.0",
"react-native-keyboard-aware-scroll-view": "^0.9.3",
"react-native-linear-gradient": "^2.5.6",
"react-native-permissions": "^3.0.0-beta.2",
"react-native-phone-number-input": "^2.0.0",
"react-native-progress": "^4.1.2",
"react-native-ratings": "^7.3.0",
"react-native-reanimated": "^1.13.1",
"react-native-responsive-screen": "^1.4.1",
"react-native-safe-area-context": "^3.1.8",
"react-native-screens": "^2.11.0",
"react-native-share": "^6.1.0",
"react-native-simple-shadow-view": "^1.6.3",
"react-native-splash-screen": "^3.2.0",
"react-native-switch": "^2.0.0",
"react-native-tab-view": "^2.15.2",
"react-native-vector-icons": "^7.1.0",
"react-native-view-shot": "^3.1.2",
"react-native-webview": "^11.2.3",
"react-redux": "^7.2.1",
"redux": "^4.0.5",
"redux-thunk": "^2.3.0",
"yup": "^0.29.3"
```

## devDependencies

```sh
"@babel/core": "^7.8.4",
"@babel/runtime": "^7.8.4",
"@react-native-community/eslint-config": "^1.1.0",
"babel-jest": "^25.1.0",
"babel-plugin-transform-remove-console": "^6.9.4",
"eslint": "^6.5.1",
"jest": "^25.1.0",
"metro-react-native-babel-preset": "^0.59.0",
"patch-package": "^6.4.7",
"postinstall-postinstall": "^2.1.0",
"react-test-renderer": "16.13.1",
"redux-devtools-extension": "^2.13.8",
"redux-logger": "^3.0.6"
```

# ToDos

1. Install the plugin(Prettier - Code formatter) on vs code.
2. While searching "save" on Preference -> Settings, "Format on Save" is displayed. Click on the checkbox to apply prettier on save.
