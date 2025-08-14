import BasicRifle from '../entities/weapons/basicRifle.js';
import Shotgun from '../entities/weapons/shotgun.js';
import HeavyGun from '../entities/weapons/heavyGun.js';
import Minigun from '../entities/weapons/miniGun.js';
import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class WeaponManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.currentWeapon = null;
		this.weaponTypes = new Map([
			['basicRifle', BasicRifle],
			['shotgun', Shotgun],
			['heavyGun', HeavyGun],
			['minigun', Minigun],
		]);

		this.setupEventListeners();
		this.equipWeapon('minigun');
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.WEAPON_SWITCH, this.handleWeaponSwitch);
		this.subscribe(GAME_EVENTS.TYPING_INPUT, this.handleTypingInput);
	}

	equipWeapon(weaponType) {
		const WeaponClass = this.weaponTypes.get(weaponType);
		if (!WeaponClass) {
			console.warn(`WeaponManager: Unknown weapon type '${weaponType}'`);
			return false;
		}

		this.currentWeapon = new WeaponClass();
		this.emit(GAME_EVENTS.WEAPON_EQUIPPED, {
			weapon: this.currentWeapon,
			weaponType,
		});

		return true;
	}

	handleWeaponSwitch(data) {
		const { weaponType } = data;
		this.equipWeapon(weaponType);
	}

	handleTypingInput(data) {
		if (!this.currentWeapon) return;

		const { key } = data;
		const currentTime = this.scene.time.now;

		if (!this.currentWeapon.canFireNow(currentTime)) return;

		const validTargets = this.findAllValidTargets(key);
		if (!validTargets.length) return;

		const sortedTargets = this.sortTargetsByDistance(validTargets, this.scene.player);
		const selectedTargets = sortedTargets.slice(0, this.currentWeapon.maxTargets);

		const fired = this.currentWeapon.fire(
			this.scene.projectileManager,
			this.scene.player,
			selectedTargets,
			currentTime
		);

		if (fired) {
			const projectile = this.scene.projectileManager.getProjectile(
				this.currentWeapon.projectileType
			);
			const damageType = projectile ? projectile.damageType : 'typing';

			selectedTargets.forEach((target) => target.handleLetterAccepted(damageType));

			this.emit(GAME_EVENTS.WEAPON_FIRED, {
				weapon: this.currentWeapon,
				source: this.scene.player,
				targets: selectedTargets,
				timestamp: currentTime,
			});
		}
	}

	findAllValidTargets(key) {
		const enemies = this.scene.enemyManager.findValidTargets(key);
		const items = this.scene.itemManager ? this.findValidItems(key) : [];
		return [...enemies, ...items];
	}

	findValidItems(key) {
		if (!this.scene.itemManager) return [];

		return this.scene.itemManager
			.getItems()
			.getChildren()
			.filter((item) => {
				if (item.isDestroyed) return false;
				return item.typedIndex < item.word.length && key === item.word[item.typedIndex];
			});
	}

	sortTargetsByDistance(targets, player) {
		return targets.sort((a, b) => {
			const distanceA = Phaser.Math.Distance.Between(player.x, player.y, a.x, a.y);
			const distanceB = Phaser.Math.Distance.Between(player.x, player.y, b.x, b.y);
			return distanceA - distanceB;
		});
	}

	getCurrentWeapon() {
		return this.currentWeapon;
	}
}
