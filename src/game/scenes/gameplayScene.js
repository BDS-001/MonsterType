import Phaser from 'phaser';
import Player from '../entities/player';
import EnemyManager from '../managers/EnemyManager';
import ItemManager from '../managers/ItemManager';
import TargetManager from '../managers/TargetManager';
import WaveManager from '../managers/WaveManager';
import WeaponManager from '../managers/WeaponManager';
import InputManager from '../managers/InputManager';
import CollisionManager from '../managers/CollisionManager';
import StateManager from '../managers/StateManager';
import AttackAnimationManager from '../managers/AttackAnimationManager';
import { GAME_EVENTS } from '../core/GameEvents';
import { gameSettings } from '../core/constants';

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');

		this.player = null;
		this.grassBackground = null;
	}

	preload() {
		this.load.image('player', 'assets/players/player.png');
		this.load.image('zombie', 'assets/enemies/zombie.png');
		this.load.image('ghost', 'assets/enemies/ghost.png');
		this.load.image('mummy', 'assets/enemies/mummy.png');
		this.load.image('grass', 'assets/environment/grass.png');
		this.load.image('basicShot', 'assets/weapons/basicShot.png');

		// Load item sprites
		this.load.image('bomb', 'assets/items/bomb.png');
		this.load.image('medkit', 'assets/items/medkit.png');
		this.load.image('healthUp', 'assets/items/healthUp.png');
	}

	create() {
		this.setupBackground();
		this.setupEventListeners();

		this.inputManager = new InputManager(this);
		this.stateManager = new StateManager(this);
		this.enemyManager = new EnemyManager(this);
		this.itemManager = new ItemManager(this);
		this.targetManager = new TargetManager(this);
		this.weaponManager = new WeaponManager(this);
		this.attackAnimationManager = new AttackAnimationManager(this);
		this.waveManager = new WaveManager(this);

		this.createPlayer();
		this.waveManager.startWaves();

		this.collisionManager = new CollisionManager(this);
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

	update() {}

	destroy() {
		this.inputManager?.destroy?.();
		this.stateManager?.destroy?.();
		this.enemyManager?.destroy?.();
		this.itemManager?.destroy?.();
		this.targetManager?.destroy?.();
		this.weaponManager?.destroy?.();
		this.attackAnimationManager?.destroy?.();
		this.waveManager?.destroy?.();
		this.collisionManager?.destroy?.();

		super.destroy();
	}
}
