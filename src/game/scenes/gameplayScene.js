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
import ScoreMultiplierManager from '../managers/ScoreMultiplierManager';
import AttackAnimationManager from '../managers/AttackAnimationManager';
import EnvironmentalEffectsManager from '../managers/EnvironmentalEffectsManager';
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
		this.load.image('slime', 'assets/enemies/slime.png');
		this.load.image('grass', 'assets/environment/grass.png');
		this.load.image('basicShot', 'assets/weapons/basicShot.png');
		this.load.image('arrowShot', 'assets/weapons/arrow.png');

		this.load.image('bomb', 'assets/items/bomb.png');
		this.load.image('medkit', 'assets/items/medkit.png');
		this.load.image('healthUp', 'assets/items/healthUp.png');
		this.load.image('shield', 'assets/items/shield.png');
		this.load.image('randomWeapon', 'assets/items/randomWeapon.png');
		this.load.image('snowflake', 'assets/effects/snowflake.png');
	}

	create() {
		this.setupBackground();
		this.setupEventListeners();

		this.cameras.main.roundPixels = true;

		this.inputManager = new InputManager(this);
		this.stateManager = new StateManager(this);
		this.scoreMultiplierManager = new ScoreMultiplierManager(this);
		this.environmentalEffectsManager = new EnvironmentalEffectsManager(this);
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
		this.game.events.on(GAME_EVENTS.GAME_OVER, this.handleGameOver, this);
		this.events.on(GAME_EVENTS.WAVE_SPAWN_ITEMS, this.handleSpawnItems, this);
		this.events.once('shutdown', this.shutdown, this);
	}

	handleSpawnItems(itemCounts) {
		this.itemManager.spawnItemsFromCounts(itemCounts);
	}

	handleGameOver(data) {
		if (data && data.reset) return;
		this.scene.pause();
		this.scene.launch('GameOver');
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

	update(time, delta) {
		this.enemyManager?.update(delta);
		this.weaponManager?.update(delta);
		this.itemManager?.update(delta);
	}

	shutdown() {
		this.game.events.off(GAME_EVENTS.GAME_OVER, this.handleGameOver, this);
		this.events.off(GAME_EVENTS.WAVE_SPAWN_ITEMS, this.handleSpawnItems, this);

		this.inputManager?.destroy?.();
		this.stateManager?.destroy?.();
		this.scoreMultiplierManager?.destroy?.();
		this.environmentalEffectsManager?.destroy?.();
		this.enemyManager?.destroy?.();
		this.itemManager?.destroy?.();
		this.targetManager?.destroy?.();
		this.weaponManager?.destroy?.();
		this.attackAnimationManager?.destroy?.();
		this.waveManager?.destroy?.();
		this.collisionManager?.destroy?.();
	}

	destroy() {
		super.destroy();
	}
}
