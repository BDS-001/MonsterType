import Phaser from 'phaser';
import wordBank from '../data/wordbank';
import { gameSettings } from '../core/constants';

/**
 * Enemy class that spawns with a word that players need to type
 */
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, minDistance, maxDistance) {
		// Constants
		const TEXT_STYLE = {
			fontFamily: 'Arial',
			fontSize: 16,
			color: '#ffffff',
		};

		const DEBUG_STYLE = {
			fontFamily: 'Arial',
			fontSize: 12,
			color: '#ffff00',
			backgroundColor: '#000000',
			padding: { x: 4, y: 2 },
		};

		// Select a random word from the word bank
		const wordCategory = 'easy';
		const wordbankIndex = Math.floor(Math.random() * wordBank[wordCategory].length);
		const word = wordBank[wordCategory][wordbankIndex];

		// Calculate random spawn position
		const spawnPosition = calculateRandomPosition(scene.player, minDistance, maxDistance);
		const spriteImage = spawnPosition.x > scene.player.x ? 'zombieLeft' : 'zombieRight';
		// Call the parent constructor
		super(scene, spawnPosition.x, spawnPosition.y, spriteImage);

		// Store references
		this.scene = scene;
		this.moveSpeed = 40;
		this.knockback = 80;
		this.fullWord = word;
		this.typedIndex = 0;
		this.hitIndex = 0;
		this.displayedWord = this.fullWord;
		this.pendingShots = 0; // Track shots that haven't hit yet
		this.totalShotsFired = 0;
		this.totalShotsHit = 0;
		this.isDestroyed = false;

		// Add this sprite to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setScale(gameSettings.SPRITE_SCALE);

		// Create the text that displays the word
		this.healthText = scene.add.text(
			spawnPosition.x,
			spawnPosition.y - this.displayHeight / 2 - 10,
			this.word,
			TEXT_STYLE
		);

		// Center the text on the sprite
		this.healthText.setOrigin(0.5);
		this.healthText.setPosition(this.x, this.y - 30);
		this.healthText.setText(this.displayedWord);

		// Create debug text display
		this.debugText = scene.add.text(this.x, this.y + 40, '', DEBUG_STYLE);
		this.debugText.setOrigin(0.5);
		this.updateDebugDisplay();
	}

	updateDebugDisplay() {
		if (this.debugText && !this.isDestroyed) {
			const debugInfo = [
				`Word: "${this.fullWord}"`,
				`Display: "${this.displayedWord}"`,
				`Typed: ${this.typedIndex}/${this.fullWord.length}`,
				`Hit: ${this.hitIndex}/${this.typedIndex}`,
				`Pending: ${this.pendingShots}`,
				`Shots: ${this.totalShotsFired}→${this.totalShotsHit}`,
				`Active: ${this.active}`,
				`Body: ${this.body ? this.body.enable : 'null'}`,
			].join('\n');

			this.debugText.setText(debugInfo);
		}
	}

	updateWord(letter) {
		if (this.isDestroyed) {
			return;
		}
		if (this.typedIndex < this.fullWord.length && letter === this.fullWord[this.typedIndex]) {
			this.typedIndex++;
			this.pendingShots++;
			this.totalShotsFired++;

			this.scene.fireProjectile(this.scene.player, this);

			this.updateDebugDisplay();
		}
	}

	takeDamage() {
		if (this.isDestroyed) {
			return;
		}

		// only apply damage if there's still a pending shot
		if (this.hitIndex < this.typedIndex && this.pendingShots > 0) {
			this.hitIndex++;
			this.pendingShots--;
			this.totalShotsHit++;

			// slice off as many letters as have _actually_ hit
			this.displayedWord = this.fullWord.slice(this.hitIndex);
			this.healthText.setText(this.displayedWord);

			// flash + knockback…
			this.setTint(0xff0000);
			this.scene.time.delayedCall(100, () => {
				if (!this.isDestroyed) {
					this.clearTint();
				}
			});
			this.knockbackEnemy();

			// if we've removed the whole word, kill the enemy
			if (this.displayedWord.length === 0) {
				this.destroy();
			} else {
				this.updateDebugDisplay();
			}
		} else {
			this.updateDebugDisplay();
		}
	}

	moveEnemy() {
		if (this.isDestroyed) return;

		//move enemy towards player
		const player = this.scene.player;
		const directionX = player.x - this.x;
		const directionY = player.y - this.y;

		// Normalize the direction vector (make it length 1)
		const length = Math.sqrt(directionX * directionX + directionY * directionY);
		const normalizedX = directionX / length;
		const normalizedY = directionY / length;

		this.setVelocity(normalizedX * this.moveSpeed, normalizedY * this.moveSpeed);
	}

	knockbackEnemy() {
		if (this.isDestroyed) return;

		const player = this.scene.player;
		const directionX = player.x - this.x;
		const directionY = player.y - this.y;

		// Normalize the direction vector (make it length 1)
		const length = Math.sqrt(directionX * directionX + directionY * directionY);
		const normalizedX = directionX / length;
		const normalizedY = directionY / length;

		this.x -= normalizedX * this.knockback;
		this.y -= normalizedY * this.knockback;
	}

	destroy(fromScene) {
		this.isDestroyed = true;

		// First destroy the text
		if (this.healthText) {
			this.healthText.destroy();
		}

		// Destroy debug text
		if (this.debugText) {
			this.debugText.destroy();
		}

		// Then call parent's destroy to destroy the sprite itself
		super.destroy(fromScene);
	}

	update(letter) {
		if (this.isDestroyed) return;

		// Update word if a letter was typed
		if (letter) {
			this.updateWord(letter);
		}

		this.moveEnemy();

		// Update text positions
		if (this.healthText) {
			this.healthText.setPosition(this.x, this.y - this.displayHeight / 2 - 10);
		}
		if (this.debugText) {
			this.debugText.setPosition(this.x, this.y + 40);
		}
	}
}

function calculateRandomPosition(target, minDistance, maxDistance) {
	const angle = Math.random() * Math.PI * 2;
	const distance = minDistance + Math.random() * (maxDistance - minDistance);

	const x = target.x + Math.cos(angle) * distance;
	const y = target.y + Math.sin(angle) * distance;

	return { x, y };
}
