# plss.inget

A mobile application built with Expo and React Native to track university assignments, deadlines, and local notification reminders instantly—without servers and without requiring an account or login.

Full project documentation:
- [Product Requirement Document (PRD)](docs/PRD.md)
- [Design Specification & Tokens](docs/design.md)

---

## Features v1

- **Quick Task Capture**: Add new tasks with title, deadline (date & time), course, and description in seconds.
- **Local Reminder System**: Automatic notifications scheduled directly on the device at the deadline and 1 hour before the deadline.
- **Structured Task Views**:
  - Urgent tasks summary for today (*Hero Summary*).
  - Tasks grouped by deadline urgency (Today, Tomorrow, This Week, Later).
  - Completed tasks section (*collapsible*) to track your progress.
- **Course Catalog**: Visual folder cards for 8 courses (class 1KA03) complete with session times, room, and lecturer info.
- **100% Offline & Private**: All data is stored locally on the device using AsyncStorage, with zero analytics or server tracking.

---

## Getting Started

### 1. Prerequisites
- Node.js (version 18 or later)
- npm, yarn, or bun
- **Expo Go** app installed on your mobile device (Android or iOS)

### 2. Dependency Installation
```bash
npm install
```

### 3. Running in Expo Go
1. Make sure your computer and mobile device are connected to the same Wi-Fi network.
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Open on your device:
   - **Android**: Open the Expo Go app, select *Scan QR Code*, and scan the QR code displayed in the terminal.
   - **iOS**: Open the default Camera app, point at the QR code, and tap the notification banner to open in Expo Go.

---

## Building an APK with EAS (Expo Application Services)

This project is pre-configured to generate a standalone Android APK without requiring local Android Studio installations:

1. Install EAS CLI globally (or use `npx`):
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Run the APK build command (using the `preview` profile defined in `eas.json`):
   ```bash
   eas build -p android --profile preview
   ```
4. Once the build finishes on Expo's cloud build servers, download and install the generated `.apk` file directly on your Android device.

---

## Folder Structure

```text
app-notes/
├── assets/             # Images, adaptive app icons, and 3D illustrations
├── docs/               # Official project documentation
│   ├── PRD.md          # Product Requirement Document
│   ├── design.md       # Design specifications, color tokens, and layout guidelines
│   └── slicing-skill.md# Slicing guidelines and UI compliance specs
├── reference/          # UI mockup reference images
├── scripts/            # Utility scripts (icon slicing & design token linting)
├── src/
│   ├── app/            # Application routes and screens (Expo Router)
│   │   ├── _layout.tsx # Root stack layout & modal presentation
│   │   ├── index.tsx   # Main screen (task list & navigation)
│   │   ├── notification-permission.tsx # Notification permission request screen
│   │   └── task/       # Task form modal (add/edit) and task detail screen
│   ├── components/     # Reusable modular UI components (TaskCard, CourseFolderCard, etc.)
│   ├── constants/      # Visual design tokens, course list data, and icon assets
│   ├── hooks/          # Custom React hooks (e.g., useColorScheme)
│   ├── services/       # Local services (AsyncStorage, notification reminders)
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper utilities and date/time formatters
├── app.json            # Expo & EAS application configuration
├── eas.json            # EAS build configuration (preview profile for APK)
├── package.json        # Project dependencies and npm scripts
└── tsconfig.json       # TypeScript configuration
```
