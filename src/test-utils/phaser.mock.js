import { vi } from 'vitest';

export default function mockPhaser() {
	vi.mock('phaser', () => ({
		default: {
			Scale: {
				FIT: 1,
				CENTER_BOTH: 1,
			},
			Physics: {
				Arcade: {
					Image: class Image {},
					Sprite: class Sprite {
						constructor(scene, x, y, texture) {
							this.scene = scene;
							this.x = x;
							this.y = y;
							this.texture = texture;
							this.displayHeight = 32;
						}
						setScale() {}
						setAlpha() {}
					},
				},
			},
		},
	}));
}
