
# 🚗 Reckless Driving

A 2D endless highway driving game built with **Phaser 3, TypeScript, and Vite**. Dodge incoming traffic, avoid collisions, survive as long as possible, and beat your highest score!

## 🎮 About the Game

Reckless Driving is an arcade-style traffic dodging game where the player drives along an endless highway filled with incoming vehicles.

The objective is to avoid collisions, travel as far as possible, and achieve the highest score.

The game features progressively increasing difficulty, different vehicle types, dynamic day and night environments, and a local high-score system.

## ✨ Features

- **Endless Gameplay:** Drive along an infinite scrolling highway.
- **Traffic System:** Encounter different vehicle types, including cars, delivery vehicles, cargo trucks, and trailers.
- **Progressive Difficulty:** Traffic difficulty increases as you progress through levels.
- **Smooth Controls:** Move the player vehicle using keyboard or mouse controls.
- **Collision Detection:** Vehicle-specific collision detection and game-over handling.
- **Dynamic Environment:** Grass, trees, bushes, road markings, and environmental scrolling.
- **Day and Night Cycle:** Environment transitions between day and night based on distance.
- **Streetlights:** Roadside lighting during night conditions.
- **Score Tracking:** Track score, distance, level, and personal best.
- **High Score Storage:** Save your best score locally using browser LocalStorage.
- **Pause and Resume:** Pause, resume, restart, or return to the main menu.
- **Settings Screen:** Access game settings and fullscreen mode.
- **Game Over Effects:** Screen shake, crash flash, and particle effects.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Phaser 3 | 2D game engine |
| TypeScript | Game logic and type safety |
| Vite | Development server and build tool |
| Howler.js | Audio management |
| HTML5 | Game structure |
| CSS3 | Styling and layout |
| LocalStorage | High-score persistence |

## 📂 Project Structure

```text
reckless-driving/
│
├── public/
│   └── assets/
│       ├── cars/
│       ├── sounds/
│       └── images/
│
├── src/
│   ├── assets/
│   ├── config/
│   │   └── gameConfig.ts
│   ├── entities/
│   │   └── Traffic.ts
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── MenuScene.ts
│   │   └── GameScene.ts
│   ├── systems/
│   │   ├── CollisionManager.ts
│   │   ├── Environment.ts
│   │   ├── ScoreManager.ts
│   │   └── TrafficSpawner.ts
│   ├── main.ts
│   └── style.css
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Nithin0427/Reckless-driving.git
```

### 2. Navigate to the project directory

```bash
cd Reckless-driving
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the game

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

## 🎯 Game Controls

| Key / Action | Function |
|---|---|
| Left Arrow | Move left |
| Right Arrow | Move right |
| Mouse | Control horizontal movement |
| P | Pause / Resume |
| ESC | Pause / Resume |

## 🏗️ Production Build

To generate the production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

The production-ready files are generated in the `dist/` directory.

## 💾 High Score

The game uses browser **LocalStorage** to save the player's best score.

The high score remains available in the same browser unless its site data is cleared. It is not synchronized between devices.

## 🚀 Future Improvements

Potential improvements for future versions:

- Mobile touch controls.
- Additional environments and road themes.
- More vehicle variations.
- Additional visual and audio effects.
- Online leaderboard support.

## 👨‍💻 Developer

**Nithin Sai Narayana Vardhineedi**

- GitHub: [@Nithin0427](https://github.com/Nithin0427)
- Project Repository: [Reckless Driving](https://github.com/Nithin0427/Reckless-driving)

---

⭐ If you like this project, consider giving the repository a star!

**Built with passion using Phaser 3 and TypeScript.**
