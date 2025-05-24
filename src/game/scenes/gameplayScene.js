import Phaser from 'phaser';
import Player from '../entities/player';
import EnemyManager from '../managers/EnemyManager'
import fpsCounter from '../util/fpsCounter';
import Projectile from '../entities/projectile';
import { gameSettings } from '../core/constants';

/**
 * Main gameplay scene
 */
export default class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');

		// Initialize properties
		this.currentKey = null;
		this.player = null;
		this.fpsDisplay = null;
		this.grassBackground = null;
		this.playerImmunity = false;
		this.projectiles = null;
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
		this.grassBackground = this.add.tileSprite(
			0,
			0, // Position at top-left corner
			this.cameras.main.width, // Width of game canvas
			this.cameras.main.height, // Height of game canvas
			'grass' // Your grass tile's image key
		);
		this.grassBackground.setScale(gameSettings.SPRITE_SCALE);

		// Set the origin to the top-left (0,0) instead of center
		this.grassBackground.setOrigin(0, 0);

		// Setup keyboard input
		this.setupKeyboardInput();

		// Create player at center of screen
		this.createPlayer();

		this.enemyManager = new EnemyManager(this);
		
		// Start spawning
		this.enemyManager.startSpawning(1000);		

		// Setup projectiles
		this.setupProjectiles();

		// Add FPS counter
		this.fpsDisplay = new fpsCounter(this);

		// Enable player and enemie collision
		this.physics.add.overlap(
			this.player,
			this.enemyManager.getEnemies(),
			this.handlePlayerEnemyCollision,
			null,
			this
		);
		this.physics.add.overlap(
			this.enemyManager.getEnemies(),
			this.projectiles,
			this.handleProjectileEnemyCollision,
			null,
			this
		);
	}

	handlePlayerEnemyCollision(player, enemy) {
		if (!this.playerImmunity) {
			player.takeDamage();
			enemy.knockbackEnemy();

			this.playerImmunity = true;
			this.time.delayedCall(200, () => {
				this.playerImmunity = false;
			});
		}
	}

	handleProjectileEnemyCollision(enemy, projectile) {
		if (!projectile.active || projectile.targetEnemyId !== enemy.id) {
			return;
		}

		enemy.takeDamage();
		projectile.kill();
	}

	// Setup keyboard input handling
	setupKeyboardInput() {
		this.input.keyboard.on('keydown', (event) => {
			this.currentKey = event.key;
		});
	}

	createPlayer() {
		const centerX = this.game.config.width / 2;
		const centerY = this.game.config.height / 2;
		this.player = new Player(this, centerX, centerY);
	}

	setupProjectiles() {
		this.projectiles = this.physics.add.group({
			classType: Projectile,
			defaultKey: 'projectile',
			maxSize: 100,
			active: false,
			visible: false,
			runChildUpdate: true,
		});
	}

	updateProjectiles() {
		const projectiles = this.projectiles.getChildren();
		for (let i = 0; i < projectiles.length; i++) {
			const projectile = projectiles[i];
			if (projectile.active) {
				projectile.update();
			}
		}
	}

	fireProjectile(source, targetEnemy) {
		const projectile = this.projectiles.get();

		if (projectile) {
			projectile.fire(source, targetEnemy);
			return true;
		}
		return false;
	}

	update() {
		// Update FPS counter
		this.fpsDisplay.updateFPS();

		// Update all enemies
		this.enemyManager.update()

		this.updateProjectiles();

		// Reset current key after updating enemies
		this.currentKey = null;
	}
}
