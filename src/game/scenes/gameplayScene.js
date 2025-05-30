import Phaser from 'phaser';
import Player from '../entities/player';
import EnemyManager from '../managers/EnemyManager';
import fpsCounter from '../util/fpsCounter';
import ProjectileManager from '../managers/ProjectileManager';
import InputManager from '../managers/InputManager';
import CollisionManager from '../managers/CollisionManager';
import gameState from '../core/gameState';
import { gameSettings } from '../core/constants';

/**
 * Main gameplay scene
 */
export default class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');

		// Initialize properties (removed playerImmunity - now handled by CollisionManager)
		this.player = null;
		this.fpsDisplay = null;
		this.grassBackground = null;
	}

	preload() {
		// Load game images
		this.load.image('player', 'assets/playerRight.png');
		this.load.image('zombieRight', 'assets/zombieRight.png');
		this.load.image('zombieLeft', 'assets/zombieLeft.png');
		this.load.image('grass', 'assets/grass.png');
		this.load.image('projectile', 'assets/basicShot.png');
	}

	create() {
		//setup gamestate
		gameState.setGameScene(this);

		// Setup background
		this.setupBackground();

		// Initialize managers
		this.inputManager = new InputManager(this);

		// Create player
		this.createPlayer();

		// Create entity managers
		this.enemyManager = new EnemyManager(this);
		this.projectileManager = new ProjectileManager(this);

		// Create collision manager
		this.collisionManager = new CollisionManager(this);

		// Start game systems
		this.enemyManager.startSpawning(1000);

		// Add FPS counter
		this.fpsDisplay = new fpsCounter(this);

		//dev text
		const devText = this.add.text(this.game.config.width / 2, 20, '🚧 GAME UNDER DEVELOPMENT 🚧', {
			fontSize: '24px',
			fontFamily: 'Arial, sans-serif',
			fill: '#ffffff',
			stroke: '#000000',
			strokeThickness: 2,
			fontStyle: 'bold'
		});
		devText.setOrigin(0.5, 0);
	}

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

	createPlayer() {
		const centerX = this.game.config.width / 2;
		const centerY = this.game.config.height / 2;
		this.player = new Player(this, centerX, centerY);
	}

	fireProjectile(source, targetEnemy) {
		const projectile = this.projectileManager.getProjectiles().get();

		if (projectile) {
			projectile.fire(source, targetEnemy);
			return true;
		}
		return false;
	}

	update() {
		// Update FPS counter
		this.fpsDisplay.updateFPS();

		// Update managers
		this.enemyManager.update(this.inputManager.getCurrentKey());
		this.projectileManager.update();
		this.inputManager.update();
	}
}
