import Phaser from 'phaser';
import { TEXT_STYLES } from '../config/fontConfig.js';
import { applyTextShadow } from '../util/textEffects.js';
import { spawnFloatingText } from '../util/floatingText.js';

export default class TypedEntity extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, texture, word = '', id = null) {
		super(scene, x, y, texture);

		this.scene = scene;
		this.id = id;
		this.word = word;
		this.hitIndex = 0;
		this.isDestroyed = false;
		this.isDying = false;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.healthText = scene.add
			.text(this.x, this.y - 30, this.word, TEXT_STYLES.ENTITY_WORD)
			.setOrigin(0.5);
		applyTextShadow(this.healthText);
	}

	update() {
		if (this.isDestroyed) return;

		this.updateTextPositions();
	}

	updateTextPositions() {
		this.healthText.setPosition(this.x, this.y - 30);
	}

	takeDamage(damage = 1) {
		if (this.isDestroyed) return;

		this.hitIndex = Math.min(this.hitIndex + damage, this.word.length);
		this.hitEffect(damage);
		this.updateDisplay();
	}

	updateDisplay() {
		if (this.isDestroyed || this.isDying) return;

		this.displayedWord = this.word.slice(this.hitIndex);
		this.healthText.setText(this.displayedWord);

		if (this.displayedWord.length === 0) {
			this.markForDestruction();
		}
	}

	markForDestruction() {
		if (this.isDying) return;

		this.isDying = true;
		this.onKill();
		this.scene.time.delayedCall(0, () => this.destroy());
	}

	hitEffect(damage = 1) {
		spawnFloatingText(this.scene, this.x, this.y - this.displayHeight / 2 - 8, `-10`, '#f44336');
	}

	onKill() {
		// Override in subclasses to add death effects or cleanup
	}

	destroy(fromScene) {
		this.healthText.destroy();
		super.destroy(fromScene);
	}
}
