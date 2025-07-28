/**
 * Main Gameplay Scene
 *
 * Core game scene that handles player interaction, enemy spawning, and game mechanics.
 * Coordinates all game systems and manages the primary game loop.
 */
import Phaser from 'phaser';
import Player from '../entities/player';
import EnemyManager from '../managers/EnemyManager';
import ProjectileManager from '../managers/ProjectileManager';
import InputManager from '../managers/InputManager';
import CollisionManager from '../managers/CollisionManager';
import gameState from '../core/gameState';
import { gameSettings } from '../core/constants';

/**
 * Primary scene containing all gameplay mechanics and entity management
 * Orchestrates player input, enemy AI, projectile physics, and collision detection
 */
export default class GameScene extends Phaser.Scene {
	/**
	 * Initialize gameplay scene
	 * Sets up core game entities and manager references
	 */
	constructor() {
		super('GameScene');

		this.player = null;
		this.grassBackground = null;
		this.gameStartTime;
	}

	/**
	 * Load all game assets before scene creation
	 * Preloads sprites for entities, backgrounds, and projectiles
	 */
	preload() {
		this.load.image('player', 'assets/playerRight.png');
		this.load.image('zombie', 'assets/zombie.png');
		this.load.image('ghost', 'assets/ghost.png');
		this.load.image('mummy', 'assets/mummy.png');
		this.load.image('grass', 'assets/grass.png');
		this.load.image('projectile', 'assets/basicShot.png');
	}

	/**
	 * Initialize the gameplay scene and all game systems
	 * Sets up entities, managers, and begins the game loop
	 */
	create() {
		gameState.setGameScene(this);
		this.setupBackground();
		this.inputManager = new InputManager(this);
		this.createPlayer();
		this.enemyManager = new EnemyManager(this);
		this.projectileManager = new ProjectileManager(this);
		this.collisionManager = new CollisionManager(this);
		this.enemyManager.startSpawning();
	}

	/**
	 * Create the repeating background environment
	 * Sets up a tiled grass texture that fills the entire screen
	 */
	setupBackground() {
		this.grassBackground = this.add.tileSprite(
			0,
			0,
			this.cameras.main.width,
			this.cameras.main.height,
			'grass'
		);
		this.grassBackground.setScale(gameSettings.SPRITE_SCALE);
		this.grassBackground.setOrigin(0, 0);
	}

	/**
	 * Create and position the player character
	 * Places player at the center of the screen
	 */
	createPlayer() {
		const centerX = this.game.config.width / 2;
		const centerY = this.game.config.height / 2;
		this.player = new Player(this, centerX, centerY);
	}

	/**
	 * Fire a projectile from source towards target enemy
	 * @param {Object} source - Entity firing the projectile (has x, y coordinates)
	 * @param {Enemy} targetEnemy - Enemy to target with the projectile
	 * @returns {number} Damage value of the fired projectile, or 0 if no projectile available
	 */
	fireProjectile(source, targetEnemy) {
		const projectile = this.projectileManager.getProjectile();

		if (projectile) {
			projectile.fire(source, targetEnemy);
			return projectile.damage;
		}
		return 0;
	}

	/**
	 * Main game loop update function
	 * Called every frame to update all game systems and check game state
	 * @param {number} time - Current game time in milliseconds
	 */
	update(time) {
		if (gameState.player.health <= 0) {
			gameState.toggleGameOver();
			this.scene.pause();
			this.scene.setVisible(true, 'GameOver');
		}

		this.enemyManager.update(time, this.inputManager.getCurrentKey());
		this.projectileManager.update();
		this.inputManager.update();
	}
}
