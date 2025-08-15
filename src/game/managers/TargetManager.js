import BaseManager from '../core/BaseManager.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class TargetManager extends BaseManager {
	constructor(scene) {
		super(scene);
		this.setupEventListeners();
	}

	setupEventListeners() {
		this.subscribe(GAME_EVENTS.WEAPON_READY_TO_FIRE, this.handleWeaponReadyToFire);
	}

	findValidTargets(letter) {
		const validTargets = [];

		if (this.scene.enemyManager) {
			const enemies = this.scene.enemyManager
				.getEnemies()
				.getChildren()
				.filter((enemy) => {
					if (enemy.isDestroyed || !enemy.isEnemyOnScreen()) return false;
					return enemy.hitIndex < enemy.word.length && letter === enemy.word[enemy.hitIndex];
				});
			validTargets.push(...enemies);
		}

		if (this.scene.itemManager) {
			const items = this.scene.itemManager
				.getItems()
				.getChildren()
				.filter((item) => {
					if (item.isDestroyed) return false;
					return item.hitIndex < item.word.length && letter === item.word[item.hitIndex];
				});
			validTargets.push(...items);
		}

		return validTargets;
	}

	sortTargetsByDistance(targets, player) {
		return targets.sort((a, b) => {
			const distanceA = Phaser.Math.Distance.Between(player.x, player.y, a.x, a.y);
			const distanceB = Phaser.Math.Distance.Between(player.x, player.y, b.x, b.y);
			return distanceA - distanceB;
		});
	}

	handleWeaponReadyToFire(data) {
		const { key, weapon, timestamp } = data;

		const validTargets = this.findValidTargets(key);
		const sortedTargets = this.sortTargetsByDistance(validTargets, this.scene.player);
		const selectedTargets = sortedTargets.slice(0, weapon.maxTargets);

		if (selectedTargets.length > 0) {
			weapon.fire(timestamp);
			this.emit(GAME_EVENTS.TARGETS_SELECTED, {
				targets: selectedTargets,
				weapon,
				key,
				timestamp,
			});
		}
	}
}
