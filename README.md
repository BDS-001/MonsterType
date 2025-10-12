# MonsterType

A fast-paced typing survival game built with Phaser 3, where your typing speed and accuracy are your only weapons against endless waves of monsters.

## Overview

MonsterType combines the intensity of wave-based survival games with typing mechanics. Battle through increasingly difficult waves of enemies by typing words that appear on screen. Each successful word typed deals damage to monsters, while mistakes could cost you the game.

## Features

### Core Gameplay

- **Endless Wave System** – Survive 30 hand-crafted waves, then face procedurally generated waves that scale infinitely
- **Typing Mechanics** – Type words to attack enemies and survive
- **Multiple Enemy Types** – Face zombies, ghosts, mummies, and slimes, each with unique behaviors
- **Score System** – Build combos and multipliers to maximize your score

### Weapons & Items

- **Weapon Variety** – Unlock and use different weapons including pistols, dual pistols, shotgun, crossbow, minigun, and lazer
- **Power-ups** – Collect items like medkits, shields, bombs, health upgrades, and score multipliers
- **Random Drops** – Discover weapon drops during gameplay

### Visual & Audio

- **Projectile Animations** – Unique animations for each weapon type
- **Environmental Effects** – Dynamic visual effects including blizzard storms
- **Floating Text** – Visual feedback for damage, combos, and score
- **Camera Effects** – Screen shake and other dynamic camera movements
- **Health Bars** – Visual health indicators for player and enemies

### Game Systems

- **Pause System** – Pause and resume gameplay at any time
- **Dev Overlay** – Development tools for debugging and testing
- **FPS Counter** – Performance monitoring
- **Main Menu** – Clean interface for starting games
- **Game Over Scene** – Score display and restart options

## Technology Stack

- **Game Engine**: Phaser 3 (v3.88.2)
- **Build Tool**: Vite (v6.3.5)
- **Testing**: Vitest (v3.2.4)
- **Language**: JavaScript (ES6+)

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/MonsterType.git

# Navigate to project directory
cd MonsterType

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
MonsterType/
├── src/
│   ├── game/
│   │   ├── animations/      # Projectile and attack animations
│   │   ├── config/          # Font and UI theme configurations
│   │   ├── core/            # Core game logic and constants
│   │   ├── data/            # Wave and wordbank data
│   │   ├── entities/        # Player, enemies, weapons, and items
│   │   ├── managers/        # Game system managers
│   │   ├── scenes/          # Phaser game scenes
│   │   └── util/            # Utility functions and helpers
│   └── main.js              # Application entry point
├── index.html
└── package.json
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
