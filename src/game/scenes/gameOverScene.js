export class GameOver extends Phaser.Scene {
	constructor() {
		super({ key: 'GameOver', active: true });
	}
	create() {
		this.scene.setVisible(false);

		// transparent backround for the scene so i can still see gameplay
		this.cameras.main.setBackgroundColor('rgba(0,0,0,0.3)');

		// Add pause-menu UI here (text/buttons), e.g.:
		this.add.text(0, 0, 'GAMEOVER', { fontSize: '48px', color: '#fff' });
	}
}
