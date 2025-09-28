import TypedEntity from '../typedEntity';
import wordBank from '../../data/wordbank.json';
import { gameSettings } from '../../core/constants';
import { GAME_EVENTS } from '../../core/GameEvents';

const defaultOptions = {
	moveSpeed: 50,
	knockback: 10,
	wordCategory: 'easy',
	damage: 10,
	dropTable: [],
};

export default class Enemy extends TypedEntity {
	constructor(scene, x, y, id, spriteImage, options = {}) {
		const enemyOptions = { ...defaultOptions, ...options };

		const wordBankIndex = Math.floor(Math.random() * wordBank[enemyOptions.wordCategory].length);
		const word = wordBank[enemyOptions.wordCategory][wordBankIndex];

		super(scene, x, y, spriteImage, word, id);

		if (this.x > scene.player.x) this.flipX = true;

		this.entityType = 'enemy';
		this.moveSpeed = enemyOptions.moveSpeed;
		this.knockback = enemyOptions.knockback;
		this.damage = enemyOptions.damage;
		this.dropTable = enemyOptions.dropTable;
		this.displayedWord = this.word;
		this.isKnockedBack = false;

		this.setScale(enemyOptions.scale ?? gameSettings.SPRITE_SCALE);
		this.scene.physics.add.existing(this);
	}

	isEnemyOnScreen() {
		const camera = this.scene.cameras.main;
		const margin = 50;

		return (
			this.x > camera.scrollX - margin &&
			this.x < camera.scrollX + camera.width + margin &&
			this.y > camera.scrollY - margin &&
			this.y < camera.scrollY + camera.height + margin
		);
	}

	knockbackEnemy() {
		if (this.isDestroyed || this.knockback === 0) return;

		const player = this.scene.player;
		const directionX = player.x - this.x;
		const directionY = player.y - this.y;
		const length = Math.sqrt(directionX * directionX + directionY * directionY);

		if (length > 0) {
			const normalizedX = directionX / length;
			const normalizedY = directionY / length;
			this.setVelocity(-normalizedX * this.knockback, -normalizedY * this.knockback);

			this.isKnockedBack = true;
			this.scene.time.delayedCall(200, () => {
				this.isKnockedBack = false;
			});
		}
	}

	hitEffect(damage = 1) {
		if (this.isDestroyed || !this.scene || !this.scene.tweens) {
			return;
		}

		super.hitEffect?.(damage);

		this.scene.tweens.add({
			targets: this,
			tint: 0xff0000,
			duration: 50,
			yoyo: true,
			onComplete: () => this.clearTint(),
		});

		this.knockbackEnemy();
	}

	moveEnemy() {
		if (this.isDestroyed || this.isKnockedBack) return;
		this.scene.physics.moveToObject(this, this.scene.player, this.moveSpeed);
	}

	update() {
		if (this.isDestroyed) return;

		this.moveEnemy();
		this.updateTextPositions();
	}

	updateTextPositions() {
		if (this.healthText) {
			this.healthText.setPosition(this.x, this.y - this.displayHeight / 2 - 10);
		}
	}

	handleItemDrop() {
		if (!this.dropTable || this.dropTable.length === 0) return;

		const totalWeight = this.dropTable.reduce((sum, entry) => sum + entry.chance, 0);

		const dropRoll = Math.random() * 100;
		if (dropRoll >= totalWeight) return;

		const itemRoll = Math.random() * totalWeight;
		let currentWeight = 0;

		for (const dropEntry of this.dropTable) {
			currentWeight += dropEntry.chance;
			if (itemRoll <= currentWeight) {
				this.scene.events.emit(GAME_EVENTS.ITEM_SPAWNED, {
					x: this.x,
					y: this.y,
					itemType: dropEntry.itemType,
				});
				break;
			}
		}
	}

	onKill() {
		this.handleItemDrop();
		this.scene.events.emit(GAME_EVENTS.ENEMY_KILLED, { enemy: this, points: 10 });
	}

	destroy(fromScene) {
		super.destroy(fromScene);
	}
}
