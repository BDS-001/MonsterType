import TypedEntity from '../typedEntity';
import wordBank from '../../data/wordbank';
import { gameSettings } from '../../core/constants';

function calculateRandomPosition(camera) {
	const width = camera.width;
	const height = camera.height;
	const margin = 100;

	const side = Math.floor(Math.random() * 4);

	let x, y;
	switch (side) {
		case 0: // Top
			x = Math.random() * width;
			y = -margin;
			break;
		case 1: // Right
			x = width + margin;
			y = Math.random() * height;
			break;
		case 2: // Bottom
			x = Math.random() * width;
			y = height + margin;
			break;
		case 3: // Left
			x = -margin;
			y = Math.random() * height;
			break;
	}

	return { x, y };
}

const defaultOptions = {
	moveSpeed: 50,
	knockback: 10,
	wordCategory: 'easy',
	damage: 10,
};

export default class Enemy extends TypedEntity {
	constructor(id, scene, spriteImage, options = {}) {
		const enemyOptions = { ...defaultOptions, ...options };

		const wordBankIndex = Math.floor(Math.random() * wordBank[enemyOptions.wordCategory].length);
		const word = wordBank[enemyOptions.wordCategory][wordBankIndex];

		const { x: spawnX, y: spawnY } = calculateRandomPosition(scene.cameras.main);

		super(scene, spawnX, spawnY, spriteImage, word, id);

		if (this.x > scene.player.x) this.flipX = true;

		this.moveSpeed = enemyOptions.moveSpeed;
		this.knockback = enemyOptions.knockback;
		this.damage = enemyOptions.damage;
		this.displayedWord = this.word;
		this.isKnockedBack = false;

		this.setScale(gameSettings.SPRITE_SCALE);
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

	hitEffect() {
		if (this.isDestroyed || !this.scene || !this.scene.tweens) {
			return;
		}

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

	onKill() {
		this.scene.events.emit('combat:enemy_killed', { enemy: this, points: 10 });
	}

	destroy(fromScene) {
		super.destroy(fromScene);
	}
}
