import Phaser from 'phaser';

export default class TypedEntity extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, texture, word = '', id = null) {
		super(scene, x, y, texture);

		this.scene = scene;
		this.id = id;
		this.word = word;
		this.typedIndex = 0;
		this.hitIndex = 0;
		this.isDestroyed = false;

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.healthText = scene.add
			.text(this.x, this.y - 30, this.word, {
				fontFamily: 'Arial',
				fontSize: 28,
				color: '#ffffff',
			})
			.setOrigin(0.5);

		this.debugText = scene.add
			.text(this.x, this.y + 40, '', {
				fontFamily: 'Arial',
				fontSize: 12,
				color: '#ffff00',
				backgroundColor: '#000000',
				padding: { x: 4, y: 2 },
			})
			.setOrigin(0.5);
		this.updateDebugDisplay();
	}

	update() {
		if (this.isDestroyed) return;

		this.updateTextPositions();
	}

	updateTextPositions() {
		this.healthText?.setPosition(this.x, this.y - 30);
		this.debugText?.setPosition(this.x, this.y + 40);
	}

	updateDebugDisplay() {
		if (this.debugText && !this.isDestroyed) {
			const debugInfo = [
				`Word: "${this.word}"`,
				`Display: "${this.getCurrentWord()}"`,
				`Typed: ${this.typedIndex}/${this.word.length}`,
				`Hit: ${this.hitIndex}`,
			].join('\n');

			this.debugText.setText(debugInfo);
		}
	}

	handleLetterAccepted(damageType = 'typing') {
		if (this.isDestroyed) return;

		this.typedIndex++;
		if (damageType === 'typing') {
			this.hitIndex++;
		}
		this.updateDisplay();
	}

	takeDamage(damage) {
		if (this.isDestroyed) return;

		this.hitIndex = Math.min(this.hitIndex + damage, this.word.length);
		this.typedIndex = Math.max(this.typedIndex, this.hitIndex);
		this.updateDisplay();
	}

	updateDisplay() {
		this.displayedWord = this.word.slice(this.hitIndex);
		this.healthText.setText(this.displayedWord);

		if (this.displayedWord.length === 0) {
			this.scene.events.emit('combat:enemy_killed', { enemy: this, points: 10 });
			this.destroy();
		} else {
			this.updateDebugDisplay();
		}
	}

	getCurrentWord() {
		return this.word.slice(this.hitIndex);
	}

	hitEffect() {
		// Override in subclasses to add visual/audio effects when hit
	}

	onKill() {
		// Override in subclasses to add death effects or cleanup
	}

	destroy(fromScene) {
		this.isDestroyed = true;
		this.healthText?.destroy();
		this.debugText?.destroy();
		this.onKill();
		super.destroy(fromScene);
	}
}
