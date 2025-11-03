import { describe, it, expect, vi, beforeEach } from 'vitest';
import InputManager from './InputManager.js';
import { createMockScene } from '../../test-utils/scene.mock.js';
import { GAME_EVENTS } from '../core/GameEvents.js';

vi.mock('../core/BaseManager.js', () => ({
	default: class BaseManager {
		constructor(scene) {
			this.scene = scene;
		}
		emit() {}
		destroy() {}
	},
}));

describe('InputManager', () => {
	let mockScene;
	let inputManager;
	let keyboardHandler;

	beforeEach(() => {
		mockScene = createMockScene({
			input: {
				keyboard: {
					on: vi.fn((event, handler) => {
						if (event === 'keydown') {
							keyboardHandler = handler;
						}
					}),
				},
			},
		});

		inputManager = new InputManager(mockScene);
		inputManager.emit = vi.fn();
	});

	describe('initialization', () => {
		it('should initialize and register keyboard listener', () => {
			expect(mockScene.input.keyboard.on).toHaveBeenCalledWith('keydown', expect.any(Function));
		});
	});

	describe('keyboard input', () => {
		it('should emit KEY_PRESSED event for lowercase letter', () => {
			keyboardHandler({ key: 'a' });

			expect(inputManager.emit).toHaveBeenCalledWith(GAME_EVENTS.KEY_PRESSED, 'a');
		});

		it('should emit KEY_PRESSED event for uppercase letter converted to lowercase', () => {
			keyboardHandler({ key: 'A' });

			expect(inputManager.emit).toHaveBeenCalledWith(GAME_EVENTS.KEY_PRESSED, 'a');
		});

		it('should emit KEY_PRESSED event for any letter a-z', () => {
			keyboardHandler({ key: 'z' });

			expect(inputManager.emit).toHaveBeenCalledWith(GAME_EVENTS.KEY_PRESSED, 'z');
		});

		it('should not emit event for numbers', () => {
			keyboardHandler({ key: '1' });

			expect(inputManager.emit).not.toHaveBeenCalled();
		});

		it('should not emit event for special characters', () => {
			keyboardHandler({ key: '!' });

			expect(inputManager.emit).not.toHaveBeenCalled();
		});

		it('should not emit event for space', () => {
			keyboardHandler({ key: ' ' });

			expect(inputManager.emit).not.toHaveBeenCalled();
		});

		it('should not emit event for Enter key', () => {
			keyboardHandler({ key: 'Enter' });

			expect(inputManager.emit).not.toHaveBeenCalled();
		});

		it('should not emit event for Escape key', () => {
			keyboardHandler({ key: 'Escape' });

			expect(inputManager.emit).not.toHaveBeenCalled();
		});

		it('should not emit event for arrow keys', () => {
			keyboardHandler({ key: 'ArrowUp' });
			keyboardHandler({ key: 'ArrowDown' });
			keyboardHandler({ key: 'ArrowLeft' });
			keyboardHandler({ key: 'ArrowRight' });

			expect(inputManager.emit).not.toHaveBeenCalled();
		});

		it('should handle multiple key presses', () => {
			keyboardHandler({ key: 'h' });
			keyboardHandler({ key: 'e' });
			keyboardHandler({ key: 'l' });
			keyboardHandler({ key: 'l' });
			keyboardHandler({ key: 'o' });

			expect(inputManager.emit).toHaveBeenCalledTimes(5);
			expect(inputManager.emit).toHaveBeenNthCalledWith(1, GAME_EVENTS.KEY_PRESSED, 'h');
			expect(inputManager.emit).toHaveBeenNthCalledWith(2, GAME_EVENTS.KEY_PRESSED, 'e');
			expect(inputManager.emit).toHaveBeenNthCalledWith(3, GAME_EVENTS.KEY_PRESSED, 'l');
			expect(inputManager.emit).toHaveBeenNthCalledWith(4, GAME_EVENTS.KEY_PRESSED, 'l');
			expect(inputManager.emit).toHaveBeenNthCalledWith(5, GAME_EVENTS.KEY_PRESSED, 'o');
		});
	});
});
