# ExpenseLite 💰

A lightweight, modern expense tracking application built with Expo and React Native. ExpenseLite provides a seamless cross-platform experience for managing your finances on iOS, Android, and the web.

## 🎯 Overview

ExpenseLite is a TypeScript-based mobile and web application designed to help users track their expenses efficiently. Built on the modern Expo framework with React Router for navigation, it delivers a smooth, intuitive user experience across all platforms.

## 📁 Project Structure

```
ExpenseLite/
├── app/                    # Main application screens and routes
├── assets/                 # Images, icons, and static assets
├── components/             # Reusable UI components
├── constants/              # App-wide constants and configuration
├── hooks/                  # Custom React hooks
├── scripts/                # Utility scripts (e.g., reset-project)
├── app.json               # Expo app configuration
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint linting rules
└── README.md             # This file
```

### Directory Details

- **`app/`** - File-based routing using Expo Router. Define your app's screens and navigation structure here.
- **`assets/`** - Contains images, icons, splash screens, and favicon for all platforms.
- **`components/`** - Reusable UI components such as buttons, cards, modals, and forms.
- **`constants/`** - Application-wide constants like colors, typography, API endpoints, and configuration values.
- **`hooks/`** - Custom React hooks for shared logic, state management, and side effects.
- **`scripts/`** - Helper scripts for project maintenance and setup.

## ✨ Key Features

- **Cross-Platform Support** - Runs on iOS, Android, and Web with a unified codebase
- **File-Based Routing** - Built with Expo Router for intuitive navigation structure
- **TypeScript** - Full TypeScript support for type safety and better developer experience
- **Modern Dependencies** - Latest versions of React, React Native, and Expo ecosystem
- **Navigation** - React Navigation with bottom tab support for seamless app navigation
- **Icons & Assets** - Expo Vector Icons for beautiful, scalable iconography
- **Web Support** - Static site generation for web deployment
- **Responsive Design** - Gesture handling and safe area management for all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ben-W3cloud/ExpenseLite.git
cd ExpenseLite
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

### Running on Different Platforms

- **iOS Simulator**
```bash
npm run ios
```

- **Android Emulator**
```bash
npm run android
```

- **Web Browser**
```bash
npm run web
```

## 📝 Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Launch the iOS simulator
- `npm run android` - Launch the Android emulator
- `npm run web` - Start the web development server
- `npm run lint` - Run ESLint to check code quality
- `npm run reset-project` - Reset to a fresh project template

## 🛠️ Tech Stack

- **Framework**: Expo + React Native 0.81
- **Language**: TypeScript 5.9
- **Navigation**: Expo Router & React Navigation
- **State Management**: React Hooks
- **UI Components**: Custom components + Expo Vector Icons
- **Build Tool**: Expo
- **Linting**: ESLint
- **Animation**: React Native Reanimated 4

## 🎨 Development Guidelines

### Code Structure
- Place reusable components in the `components/` directory
- Create custom hooks in `hooks/` for shared logic
- Store constants in `constants/` for easy maintenance
- Define app screens in `app/` using file-based routing

### Type Safety
This project uses TypeScript. Ensure all new files include proper type annotations for better code quality and IDE support.

### Linting
Run the linter before committing code:
```bash
npm run lint
```

## 🌐 Platform Support

- **iOS**: Optimized for iPhone and iPad
- **Android**: Full support with adaptive icons
- **Web**: Static site generation with responsive design

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

We welcome contributions! Please follow the existing code style and run the linter before submitting pull requests.

## 📄 License

This project is open source and available on GitHub.

## 🙋 Support

For questions and support, please open an issue on the [GitHub repository](https://github.com/Ben-W3cloud/ExpenseLite).

---

Built with ❤️ using Expo and React Native
```
