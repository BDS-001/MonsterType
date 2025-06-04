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

        this.word = wordBank[wordCategory][wordBankIndex]
        this.displayedWord = this.fullWord;
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
}