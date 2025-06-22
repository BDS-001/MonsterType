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
	 */
	constructor(scene, x, y, texture, word = '') {
		super(scene, x, y, texture);

		// Word-based interaction properties
		this.word = word; // Complete word to type
		this.typedIndex = 0; // Progress through typing the word
		this.hitIndex = 0; // Progress through projectile hits
		this.pendingDamage = 0; // Damage queued for application
		this.isDestroyed = false; // Destruction state flag

		// Register with scene systems
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Create text display for the word above the entity
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

		// Center the word text above the sprite
		this.healthText.setOrigin(0.5);
		this.healthText.setPosition(this.x, this.y - 30);

		// Create debug information display (for development)
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

		// Check if the typed letter matches the next character in the word
		if (this.typedIndex < this.word.length && letter === this.word[this.typedIndex]) {
			// Fire a projectile towards this entity
			const projectileDamage = this.scene.fireProjectile(this.scene.player, this);
			if (projectileDamage > 0) {
				// Advance typing progress and queue damage for when projectile hits
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

		// Only apply damage if there's queued damage from successful typing
		if (this.pendingDamage > 0) {
			// Apply damage and reduce pending damage
			this.hitIndex += damage;
			this.pendingDamage -= damage;

			// Prevent hit index from exceeding word length
			this.hitIndex = Math.min(this.hitIndex, this.word.length);

			// Synchronize typing progress with damage progress
			this.typedIndex = this.hitIndex;

			// Trigger visual damage effect
			this.hitEffect();

			// Update displayed word by removing hit characters
			this.displayedWord = this.word.slice(this.hitIndex);
			this.healthText.setText(this.displayedWord);

			// Destroy entity if entire word has been typed/hit
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

		// Clean up word display text
		if (this.healthText) {
			this.healthText.destroy();
		}

		// Clean up debug information display
		if (this.debugText) {
			this.debugText.destroy();
		}

		// Execute subclass-specific destruction logic
		this.onKill();

		// Destroy the sprite itself using parent class method
		super.destroy(fromScene);
	}
}
