import Phaser from 'phaser';

export default class TypedEntity extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, texture, word = '') {
		super(scene, x, y, texture);

		this.word = word;
		this.typedIndex = 0;
		this.hitIndex = 0;
		this.pendingDamage = 0;
		this.isDestroyed = false;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Create the text that displays the word
		const TEXT_STYLE = {
			fontFamily: 'Arial',
			fontSize: 28,
			color: '#ffffff',
		};
		this.healthText = scene.add.text(
			this.x,
			this.y - this.displayHeight / 2 - 10,
			this.word,
			TEXT_STYLE
		);

		// Center the text on the sprite
		this.healthText.setOrigin(0.5);
		this.healthText.setPosition(this.x, this.y - 30);

		// Create debug text display
		const DEBUG_STYLE = {
			fontFamily: 'Arial',
			fontSize: 12,
			color: '#ffff00',
			backgroundColor: '#000000',
			padding: { x: 4, y: 2 },
		};
		this.debugText = scene.add.text(this.x, this.y + 40, '', DEBUG_STYLE);
		this.debugText.setOrigin(0.5);
		this.updateDebugDisplay();
	}

	updateDebugDisplay() {
		if (this.debugText && !this.isDestroyed) {
			const debugInfo = [
				`Word: "${this.word}"`,
				`Display: "${this.getCurrentWord()}"`,
				`Typed: ${this.typedIndex}/${this.word.length}`,
				`Hit: ${this.hitIndex}`,
				`PendingDmg: ${this.pendingDamage}`,
			].join('\n');

			this.debugText.setText(debugInfo);
		}
	}

	updateWord(letter) {
		if (this.isDestroyed) {
			return;
		}

		if (this.typedIndex < this.word.length && letter === this.word[this.typedIndex]) {
			const projectileDamage = this.scene.fireProjectile(this.scene.player, this);
			if (projectileDamage > 0) {
				this.typedIndex++;
				this.pendingDamage += projectileDamage;
			}
			this.updateDebugDisplay();
		}
	}

	takeDamage(damage) {
		if (this.isDestroyed) {
			return;
		}

		// only apply damage if there's pending damage to be applied
		if (this.pendingDamage > 0) {
			this.hitIndex += damage;
			this.pendingDamage -= damage;

			// clamp the hitIndex so damage greater than 1 does not go out of bounds
			this.hitIndex = Math.min(this.hitIndex, this.word.length);

			// adjust typedIndex to match the current display position
			this.typedIndex = this.hitIndex;

			this.hitEffect();

			// slice off as many letters as have actually hit
			this.displayedWord = this.word.slice(this.hitIndex);
			this.healthText.setText(this.displayedWord);

			// if we've removed the whole word, kill the enemy
			if (this.displayedWord.length === 0) {
				this.destroy();
			} else {
				this.updateDebugDisplay();
			}
		}
	}

	hitEffect() {
		return;
	}

	getCurrentWord() {
		if (this.hitIndex >= this.word.length) {
			return '';
		}
		return this.word.substring(this.hitIndex);
	}

	onKill() {
		return
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

		//run kill effect
		this.onKill()

		// Then call parent's destroy to destroy the sprite itself
		super.destroy(fromScene);
	}
}
