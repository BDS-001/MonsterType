import Phaser from 'phaser';
import Player from '../entities/player';
import EnemyManager from '../managers/EnemyManager';
import ItemManager from '../managers/ItemManager';
import WaveManager from '../managers/WaveManager';
import ProjectileManager from '../managers/ProjectileManager';
import InputManager from '../managers/InputManager';
import CollisionManager from '../managers/CollisionManager';
import StateManager from '../managers/StateManager';
import { GAME_EVENTS } from '../core/GameEvents';
import { gameSettings } from '../core/constants';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');

		this.player = null;
		this.grassBackground = null;
	}

	preload() {
		this.load.image('player', 'assets/player.png');
		this.load.image('zombie', 'assets/zombie.png');
		this.load.image('ghost', 'assets/ghost.png');
		this.load.image('mummy', 'assets/mummy.png');
		this.load.image('grass', 'assets/grass.png');
		this.load.image('projectile', 'assets/basicShot.png');
	}

	create() {
		this.setupBackground();
		this.setupEventListeners();

		this.inputManager = new InputManager(this);
		this.stateManager = new StateManager(this);
		this.enemyManager = new EnemyManager(this);
		this.itemManager = new ItemManager(this);
		this.projectileManager = new ProjectileManager(this);
		this.collisionManager = new CollisionManager(this);
		this.waveManager = new WaveManager(this);

		this.createPlayer();
		this.waveManager.startWaves();
		this.events.emit(GAME_EVENTS.SCENE_READY);
	}

	setupEventListeners() {
		this.events.on(GAME_EVENTS.GAME_OVER, this.handleGameOver, this);
		this.events.on(GAME_EVENTS.WAVE_SPAWN_ENEMIES, this.handleSpawnEnemies, this);
		this.events.on(GAME_EVENTS.WAVE_SPAWN_ITEMS, this.handleSpawnItems, this);
	}

	handleSpawnEnemies(enemyCounts) {
		this.enemyManager.spawnEnemiesFromCounts(enemyCounts);
	}

	handleSpawnItems(itemCounts) {
		this.itemManager.spawnItemsFromCounts(itemCounts);
	}

	handleGameOver() {
		this.scene.pause();
		this.scene.setVisible(true, 'GameOver');
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

	update() {
		this.projectileManager.update();
	}
}
