import Phaser from 'phaser';
import wordBank from '../../data/wordbank';
import { gameSettings } from '../../core/constants';

function calculateRandomPosition(camera) {
	const width = camera.width;
	const height = camera.height;

	const centerX = width / 2;
	const centerY = height / 2;

	const angle = Math.random() * Math.PI * 2;
	const maxRadius = Math.sqrt(width * width + height * height) / 2 + 50;

	let x = centerX + Math.cos(angle) * maxRadius;
	let y = centerY + Math.sin(angle) * maxRadius;

	return { x, y };
}

const defaultOptions = {moveSpeed: 50, knockback:10}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(id, scene, spriteImage, wordCategory, options = {}) {
        //get options
        const enemyOptions = {...defaultOptions, ...options}

        //set sprite word
        const wordBankIndex = Math.floor(Math.random() * wordBank[wordCategory].length)
        this.word = wordBank[wordCategory][wordBankIndex]

        //get coordinates
        const {x: spawnX, y:spawnY} = calculateRandomPosition(scene.cameras.main);

        //call super
        super(scene, spawnX, spawnY, spriteImage)

        //enemy store
        this.id = id

        this.moveSpeed = enemyOptions.moveSpeed
        this.knockback = enemyOptions.knockback

        this.displayedWord = this.word;
        this.typedIndex = 0;
		this.hitIndex = 0;
        this.pendingShots = 0;
        this.totalShotsFired = 0;
		this.totalShotsHit = 0;

        this.isDestroyed = false;

        // Add this sprite to the scene
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setScale(gameSettings.SPRITE_SCALE);

        // Create the text that displays the word
        const TEXT_STYLE = {
			fontFamily: 'Arial',
			fontSize: 16,
			color: '#ffffff',
		};
		this.healthText = scene.add.text(
			this.x,
			this.y - this.displayHeight / 2 - 10,
			this.displayedWord,
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
				`Display: "${this.displayedWord}"`,
				`Typed: ${this.typedIndex}/${this.word.length}`,
				`Hit: ${this.hitIndex}/${this.typedIndex}`,
				`Pending: ${this.pendingShots}`,
				`Shots: ${this.totalShotsFired}→${this.totalShotsHit}`,
				`Active: ${this.active}`,
				`Body: ${this.body ? this.body.enable : 'null'}`,
			].join('\n');

			this.debugText.setText(debugInfo);
		}
	}

    isEnemyOnScreen() {
		const camera = this.scene.cameras.main;
		const margin = 50; // Small buffer zone

		return (
			this.x > camera.scrollX - margin &&
			this.x < camera.scrollX + camera.width + margin &&
			this.y > camera.scrollY - margin &&
			this.y < camera.scrollY + camera.height + margin
		);
	}

    updateWord(letter) {
		if (this.isDestroyed) {
			return;
		}
		if (this.typedIndex < this.word.length && letter === this.word[this.typedIndex]) {
			const projectileFired = this.scene.fireProjectile(this.scene.player, this);
			if (projectileFired) {
				this.typedIndex++;
				this.pendingShots++;
				this.totalShotsFired++;
			}
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
			this.displayedWord = this.word.slice(this.hitIndex);
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
        
        // add length check to prevent division by zero
        if (length > 0) {
            const normalizedX = directionX / length;
            const normalizedY = directionY / length;
            this.setVelocity(normalizedX * this.moveSpeed, normalizedY * this.moveSpeed);
        }
    }

    knockbackEnemy() {
        if (this.isDestroyed || this.knockback === 0) return;

        const player = this.scene.player;
        const directionX = player.x - this.x;
        const directionY = player.y - this.y;

        // Normalize the direction vector (make it length 1)
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        
        // add length check to prevent division by zero
        if (length > 0) {
            const normalizedX = directionX / length;
            const normalizedY = directionY / length;
            this.x -= normalizedX * this.knockback;
            this.y -= normalizedY * this.knockback;
        }
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
		if (this.isEnemyOnScreen() && letter) {
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