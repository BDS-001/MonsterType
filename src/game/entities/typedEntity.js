import Phaser from 'phaser';
import { GAME_EVENTS } from '../core/GameEvents.js';

export default class TypedEntity extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, texture, word = '', id = null) {
		super(scene, x, y, texture);

		this.id = id;
		this.word = word;
		this.typedIndex = 0;
		this.hitIndex = 0;
		this.pendingDamage = 0;
		this.isDestroyed = false;

		scene.add.existing(this);
		scene.physics.add.existing(this);

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

		this.healthText.setOrigin(0.5);
		this.healthText.setPosition(this.x, this.y - 30);

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

	update(letter) {
		if (this.isDestroyed) return;

		// Update text positions to follow the entity
		this.updateTextPositions();

		if (letter) {
			this.updateWord(letter);
		}
	}

	updateTextPositions() {
		if (this.healthText) {
			this.healthText.setPosition(this.x, this.y - 30);
		}
		if (this.debugText) {
			this.debugText.setPosition(this.x, this.y + 40);
		}
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
			this.scene.events.emit(GAME_EVENTS.LETTER_TYPED, {
				source: this.scene.player,
				target: this,
				damage: 1,
				letter: letter,
				entityId: this.id,
			});

			this.typedIndex++;
			this.pendingDamage += 1;
			this.updateDebugDisplay();
		}
	}

	takeDamage(damage) {
		if (this.isDestroyed) {
			return;
		}

		if (this.pendingDamage > 0) {
			this.hitIndex += damage;
			this.pendingDamage -= damage;
			this.pendingDamage = Math.max(0, this.pendingDamage); // Prevent negative
			this.hitIndex = Math.min(this.hitIndex, this.word.length);
			this.typedIndex = this.hitIndex;

			this.hitEffect();

			this.displayedWord = this.word.slice(this.hitIndex);
			this.healthText.setText(this.displayedWord);

			if (this.displayedWord.length === 0) {
				this.destroy();
			} else {
				this.updateDebugDisplay();
			}
		}
	}

	hitEffect() {}

	getCurrentWord() {
		if (this.hitIndex >= this.word.length) {
			return '';
		}
		return this.word.substring(this.hitIndex);
	}

	onKill() {}

	destroy(fromScene) {
		this.isDestroyed = true;

		if (this.healthText) {
			this.healthText.destroy();
		}

		if (this.debugText) {
			this.debugText.destroy();
		}

		this.onKill();
		super.destroy(fromScene);
	}
}
