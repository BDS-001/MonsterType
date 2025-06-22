/**
 * KeyStrike Game Entry Point
 *
 * A typing-based action game built with Phaser.js where players type words
 * to eliminate enemies and survive waves of attacks.
 */
import './style.css';
import Game from './game/core/game';
import { phaserConfig } from './game/core/constants';

// Initialize and start the game
new Game(phaserConfig);
