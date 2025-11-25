import { describe, it, expect, vi, beforeEach } from 'vitest';
import mockPhaser from '../../test-utils/phaser.mock.js';
import { GAME_EVENTS } from '../core/GameEvents.js';
import { TEXT_STYLES } from '../config/fontConfig.js';

mockPhaser();
const { GameOver } = await import('./gameOverScene.js');

describe('GameOver', () => {
	let gameOverScene;
	let mockGame;
	let mockCamera;
	let mockTweens;
	let mockAdd;
	let mockGameEvents;
	let mockSceneManager;

	beforeEach(() => {
		const mockText = {
			setOrigin: vi.fn().mockReturnThis(),
			setShadow: vi.fn().mockReturnThis(),
			setInteractive: vi.fn().mockReturnThis(),
			on: vi.fn().mockReturnThis(),
		};

		mockCamera = {
			setBackgroundColor: vi.fn(),
			roundPixels: false,
		};

		mockTweens = {
			add: vi.fn(),
			killTweensOf: vi.fn(),
		};

		mockAdd = {
			text: vi.fn(() => mockText),
		};

		mockGameEvents = {
			emit: vi.fn(),
		};

		mockSceneManager = {
			stop: vi.fn(),
			start: vi.fn(),
			launch: vi.fn(),
		};

		mockGame = {
			config: {
				width: 800,
				height: 600,
			},
			events: mockGameEvents,
		};

		gameOverScene = new GameOver();
		gameOverScene.cameras = { main: mockCamera };
		gameOverScene.add = mockAdd;
		gameOverScene.game = mockGame;
		gameOverScene.tweens = mockTweens;
		gameOverScene.scene = mockSceneManager;
	});

	it('should initialize with correct key', () => {
		const newScene = new GameOver();
		expect(newScene.scene.key).toBe('GameOver');
	});

	it('should initialize playAgainButton as null', () => {
		const newScene = new GameOver();
		expect(newScene.playAgainButton).toBe(null);
	});

	describe('create', () => {
		it('should set camera background color', () => {
			gameOverScene.create();
			expect(mockCamera.setBackgroundColor).toHaveBeenCalledWith('rgba(0,0,0,0.3)');
		});

		it('should create GAME OVER text with correct properties', () => {
			gameOverScene.create();

			expect(mockAdd.text).toHaveBeenCalledWith(400, 190, 'GAME OVER', {
				...TEXT_STYLES.UI_LARGE,
				color: '#ff4444',
			});
		});

		it('should set GAME OVER text origin and shadow', () => {
			gameOverScene.create();

			const gameOverText = mockAdd.text.mock.results[0].value;
			expect(gameOverText.setOrigin).toHaveBeenCalledWith(0.5);
			expect(gameOverText.setShadow).toHaveBeenCalledWith(0, 4, '#000000', 6, true, true);
		});

		it('should create PLAY AGAIN button with correct properties', () => {
			gameOverScene.create();

			expect(mockAdd.text).toHaveBeenCalledWith(400, 300, 'PLAY AGAIN', TEXT_STYLES.UI_LARGE);
		});

		it('should set PLAY AGAIN button origin and make it interactive', () => {
			gameOverScene.create();

			const playAgainButton = mockAdd.text.mock.results[1].value;
			expect(playAgainButton.setOrigin).toHaveBeenCalledWith(0.5);
			expect(playAgainButton.setInteractive).toHaveBeenCalledWith({ useHandCursor: true });
		});

		it('should store playAgainButton reference', () => {
			gameOverScene.create();

			const playAgainButton = mockAdd.text.mock.results[1].value;
			expect(gameOverScene.playAgainButton).toBe(playAgainButton);
		});

		it('should register pointerdown event listener', () => {
			gameOverScene.create();

			const playAgainButton = mockAdd.text.mock.results[1].value;
			expect(playAgainButton.on).toHaveBeenCalledWith(
				'pointerdown',
				gameOverScene.playAgain,
				gameOverScene
			);
		});

		it('should register pointerover event listener', () => {
			gameOverScene.create();

			const playAgainButton = mockAdd.text.mock.results[1].value;
			const pointeroverCall = playAgainButton.on.mock.calls.find(
				(call) => call[0] === 'pointerover'
			);
			expect(pointeroverCall).toBeDefined();
		});

		it('should register pointerout event listener', () => {
			gameOverScene.create();

			const playAgainButton = mockAdd.text.mock.results[1].value;
			const pointeroutCall = playAgainButton.on.mock.calls.find((call) => call[0] === 'pointerout');
			expect(pointeroutCall).toBeDefined();
		});

		it('should set camera roundPixels to true', () => {
			gameOverScene.create();
			expect(mockCamera.roundPixels).toBe(true);
		});

		describe('button hover effects', () => {
			let playAgainButton;
			let pointeroverHandler;
			let pointeroutHandler;

			beforeEach(() => {
				gameOverScene.create();
				playAgainButton = mockAdd.text.mock.results[1].value;

				const pointeroverCall = playAgainButton.on.mock.calls.find(
					(call) => call[0] === 'pointerover'
				);
				pointeroverHandler = pointeroverCall[1];

				const pointeroutCall = playAgainButton.on.mock.calls.find(
					(call) => call[0] === 'pointerout'
				);
				pointeroutHandler = pointeroutCall[1];
			});

			it('should kill existing tweens on pointerover', () => {
				pointeroverHandler();
				expect(mockTweens.killTweensOf).toHaveBeenCalledWith(playAgainButton);
			});

			it('should scale up button on pointerover', () => {
				pointeroverHandler();
				expect(mockTweens.add).toHaveBeenCalledWith({
					targets: playAgainButton,
					scaleX: 1.12,
					scaleY: 1.12,
					duration: 120,
					ease: 'Sine.easeOut',
				});
			});

			it('should kill existing tweens on pointerout', () => {
				pointeroutHandler();
				expect(mockTweens.killTweensOf).toHaveBeenCalledWith(playAgainButton);
			});

			it('should scale down button on pointerout', () => {
				pointeroutHandler();
				expect(mockTweens.add).toHaveBeenCalledWith({
					targets: playAgainButton,
					scaleX: 1,
					scaleY: 1,
					duration: 120,
					ease: 'Sine.easeOut',
				});
			});
		});
	});

	describe('playAgain', () => {
		beforeEach(() => {
			gameOverScene.create();
		});

		it('should emit GAME_OVER event with reset flag', () => {
			gameOverScene.playAgain();

			expect(mockGameEvents.emit).toHaveBeenCalledWith(GAME_EVENTS.GAME_OVER, {
				reset: true,
			});
		});

		it('should stop GameScene', () => {
			gameOverScene.playAgain();
			expect(mockSceneManager.stop).toHaveBeenCalledWith('GameScene');
		});

		it('should start GameScene', () => {
			gameOverScene.playAgain();
			expect(mockSceneManager.start).toHaveBeenCalledWith('GameScene');
		});

		it('should launch HudScene', () => {
			gameOverScene.playAgain();
			expect(mockSceneManager.launch).toHaveBeenCalledWith('HudScene');
		});

		it('should call scene methods in correct order', () => {
			gameOverScene.playAgain();

			const emitCallOrder = mockGameEvents.emit.mock.invocationCallOrder[0];
			const stopCallOrder = mockSceneManager.stop.mock.invocationCallOrder[0];
			const startCallOrder = mockSceneManager.start.mock.invocationCallOrder[0];
			const launchCallOrder = mockSceneManager.launch.mock.invocationCallOrder[0];

			expect(emitCallOrder).toBeLessThan(stopCallOrder);
			expect(stopCallOrder).toBeLessThan(startCallOrder);
			expect(startCallOrder).toBeLessThan(launchCallOrder);
		});
	});

	describe('destroy', () => {
		it('should call parent destroy method', () => {
			const destroySpy = vi.spyOn(Phaser.Scene.prototype, 'destroy');
			gameOverScene.destroy();
			expect(destroySpy).toHaveBeenCalled();
		});
	});
});
