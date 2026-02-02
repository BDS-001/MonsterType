import Item from './item.js';
import { GAME_EVENTS } from '../../core/GameEvents.js';

export default class Thunderstorm extends Item {
	constructor(scene, x, y, itemId) {
		super(scene, x, y, 'THUNDERSTORM', itemId, 'thunderstorm');
	}

	onKill() {
		const minInterval = 100;
		const maxInterval = 1500;
		const strikeDamage = 2;
		const scene = this.scene;

		const strikeEnemy = () => {
			const enemies = scene.enemyManager.getEnemies().getChildren();
			const aliveEnemies = enemies.filter((e) => !e.isDestroyed);

			if (aliveEnemies.length > 0) {
				const target = Phaser.Utils.Array.GetRandom(aliveEnemies);
				target.takeDamage(strikeDamage);

				const lightning = scene.add.graphics();
				lightning.lineStyle(3, 0xffff00, 1);
				lightning.lineBetween(target.x, 0, target.x, target.y);
				lightning.setDepth(10002);

				scene.time.delayedCall(100, () => {
					lightning.destroy();
				});
			}

			const nextDelay = Phaser.Math.Between(minInterval, maxInterval);
			lightningTimer.reset({
				delay: nextDelay,
				callback: strikeEnemy,
				loop: false,
			});
		};

		const lightningTimer = scene.time.addEvent({
			delay: Phaser.Math.Between(minInterval, maxInterval),
			callback: strikeEnemy,
			loop: false,
		});

		scene.events.emit(GAME_EVENTS.ENVIRONMENTAL_EFFECT_ACTIVATE, {
			effectType: 'thunderstorm',
			duration: this.config.duration,
			config: {
				duration: this.config.duration,
				timer: lightningTimer,
			},
		});
	}
}
