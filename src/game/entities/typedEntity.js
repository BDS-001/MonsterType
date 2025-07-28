/**
 * Typed Entity Base Class
 *
 * Base class for game entities that can be targeted by typing their associated words.
 * Handles word display, typing validation, damage tracking, and visual feedback.
 */
import Phaser from 'phaser';

/**
 * Interactive entity that responds to typed input
 * Extends Phaser's Arcade Physics Image with word-based interaction system
 */
export default class TypedEntity extends Phaser.Physics.Arcade.Image {
	/**
	 * Create a new typed entity
	 * @param {Phaser.Scene} scene - The scene this entity belongs to
	 * @param {number} x - Initial X position
	 * @param {number} y - Initial Y position
	 * @param {string} texture - Sprite texture key
	 * @param {string} word - Word that must be typed to target this entity
	 * @param {string} id - Unique identifier for this entity
	 */
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

	/**
	 * Update debug information display
	 * Shows typing progress, damage state, and word status for development
	 */
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

	/**
	 * Process a typed letter and check if it matches the next expected character
	 * @param {string} letter - The letter that was typed
	 */
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

	/**
	 * Apply damage when projectile hits this entity
	 * @param {number} damage - Amount of damage to apply
	 */
	takeDamage(damage) {
		if (this.isDestroyed) {
			return;
		}

		if (this.pendingDamage > 0) {
			this.hitIndex += damage;
			this.pendingDamage -= damage;
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

	/**
	 * Override this method in subclasses to provide custom hit effects
	 * Base implementation does nothing - meant to be extended
	 */
	hitEffect() {
		return;
	}

	/**
	 * Get the remaining portion of the word that still needs to be typed
	 * @returns {string} The remaining untyped characters
	 */
	getCurrentWord() {
		if (this.hitIndex >= this.word.length) {
			return '';
		}
		return this.word.substring(this.hitIndex);
	}

	/**
	 * Override this method in subclasses to handle entity destruction
	 * Called when the entity is about to be destroyed
	 */
	onKill() {
		return;
	}

	/**
	 * Clean up and destroy this entity and all associated display elements
	 * @param {boolean} fromScene - Whether destruction was initiated by scene cleanup
	 */
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
