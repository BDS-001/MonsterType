import Phaser from 'phaser';
import Player from '../entities/player';
import EnemyManager from '../managers/EnemyManager';
import WaveManager from '../managers/WaveManager';
import ProjectileManager from '../managers/ProjectileManager';
import InputManager from '../managers/InputManager';
import CollisionManager from '../managers/CollisionManager';
import gameState from '../core/gameState';
import { gameSettings } from '../core/constants';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');

		this.player = null;
		this.grassBackground = null;
	}

	preload() {
		this.load.image('player', 'assets/playerRight.png');
		this.load.image('zombie', 'assets/zombie.png');
		this.load.image('ghost', 'assets/ghost.png');
		this.load.image('mummy', 'assets/mummy.png');
		this.load.image('grass', 'assets/grass.png');
		this.load.image('projectile', 'assets/basicShot.png');
	}

	create() {
		gameState.setGameScene(this);
		this.setupBackground();
		this.inputManager = new InputManager(this);
		this.createPlayer();
		this.enemyManager = new EnemyManager(this);
		this.waveManager = new WaveManager(this);
		this.projectileManager = new ProjectileManager(this);
		this.collisionManager = new CollisionManager(this);
		this.waveManager.startWaves((enemyCounts) => {
			this.enemyManager.spawnEnemiesFromCounts(enemyCounts);
		});
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
		const projectile = this.projectileManager.getProjectile();

		if (projectile) {
			projectile.fire(source, targetEnemy);
			return projectile.damage;
		}
		return 0;
	}

	update() {
		if (gameState.player.health <= 0) {
			gameState.toggleGameOver();
			this.scene.pause();
			this.scene.setVisible(true, 'GameOver');
		}

		this.enemyManager.update(this.inputManager.getCurrentKey());
		this.projectileManager.update();
		this.inputManager.update();

		if (this.enemyManager.getEnemyCount() <= 0) {
			this.waveManager.onWaveComplete();
		}
	}
}
