import { TEXT_STYLES } from '../config/fontConfig.js';

export class MainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenu' });
		this.playButton = null;
	}

	preload() {
		this.load.image('menuBackground', 'assets/ui/menuBackground.png');
	}

	create() {
		this.scene.launch('DevOverlayScene');

		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		const { width, height } = this.game.config;
		const bg = this.add.image(width / 2, height / 2, 'menuBackground');
		const scaleX = width / bg.width;
		const scaleY = height / bg.height;
		const scale = Math.max(scaleX, scaleY);
		bg.setScale(scale).setScrollFactor(0).setDepth(-10);

		this.add
			.text(this.game.config.width / 2, this.game.config.height / 2 - 110, 'MONSTERTYPE', {
				...TEXT_STYLES.UI_LARGE,
				fill: '#39FF14',
				fontSize: '72px',
			})
			.setOrigin(0.5)
			.setShadow(0, 4, '#000000', 6, true, true);

		const playButton = this.add
			.text(
				this.game.config.width / 2,
				this.game.config.height / 2,
				'START GAME',
				TEXT_STYLES.UI_LARGE
			)
			.setOrigin(0.5);
		playButton.setInteractive({ useHandCursor: true });
		this.playButton = playButton;

		playButton.on('pointerdown', this.onPlayClick, this);

		playButton.on('pointerover', () => {
			this.tweens.killTweensOf(playButton);
			this.tweens.add({
				targets: playButton,
				scaleX: 1.12,
				scaleY: 1.12,
				duration: 120,
				ease: 'Sine.easeOut',
			});
		});
		playButton.on('pointerout', () => {
			this.tweens.killTweensOf(playButton);
			this.tweens.add({
				targets: playButton,
				scaleX: 1,
				scaleY: 1,
				duration: 120,
				ease: 'Sine.easeOut',
			});
		});

		this.cameras.main.roundPixels = true;
	}

	onPlayClick() {
		this.input.enabled = false;
		this.scene.setVisible(false);
		this.scene.start('GameScene');
	}

	destroy() {
		super.destroy();
	}
}
