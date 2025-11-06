import { describe, it, expect, vi, beforeEach } from 'vitest';
import StateManager from './StateManager';
import { createMockScene } from '../../test-utils/scene.mock';
import { GAME_EVENTS } from '../core/GameEvents';

vi.mock('../core/BaseManager.js', () => {
	return {
		default: class BaseManager {
			constructor(scene) {
				this.scene = scene;
			}
			subscribe = vi.fn();
			emit = vi.fn();
			subscribeGame = vi.fn();
			emitGame = vi.fn();
		},
	};
});

describe('StateManager', () => {
	let stateManager;
	let scene;
	beforeEach(() => {
		scene = createMockScene();
		stateManager = new StateManager(scene);
	});

	it('should initialize with correct properties', () => {
		expect(stateManager.scene).toBe(scene);
	});

	it('should initialize with correct function calls', () => {
		const reset = vi.spyOn(StateManager.prototype, 'resetState');
		const setupListeners = vi.spyOn(StateManager.prototype, 'setupEventListeners');
		new StateManager(scene);
		expect(reset).toHaveBeenCalled();
		expect(setupListeners).toHaveBeenCalled();
	});

	it('should subscribe to correct events', () => {
		expect(stateManager.subscribe).toHaveBeenCalledWith(
			GAME_EVENTS.ENEMY_KILLED,
			stateManager.handleEnemyKilled
		);
		expect(stateManager.subscribe).toHaveBeenCalledWith(
			GAME_EVENTS.PLAYER_HIT,
			stateManager.playerHit
		);
		expect(stateManager.subscribeGame).toHaveBeenCalledWith(
			GAME_EVENTS.MULTIPLIER_CHANGED,
			stateManager.handleMultiplierChanged
		);
		expect(stateManager.subscribeGame).toHaveBeenCalledWith(
			GAME_EVENTS.GAME_OVER,
			stateManager.handleGameRestart
		);
	});

	describe('resetState', () => {
		it('should reset state to initial values', () => {
			stateManager.state.score = 100;
			stateManager.state.scoreMultiplier = 2;
			stateManager.state.gameOver = true;

			stateManager.resetState();

			expect(stateManager.state.score).toBe(0);
			expect(stateManager.state.scoreMultiplier).toBe(1);
			expect(stateManager.state.gameOver).toBe(false);
		});
	});

	describe('handleEnemyKilled', () => {
		it('should call updateScore with points from data', () => {
			const updateScoreSpy = vi.spyOn(stateManager, 'updateScore');
			const data = { points: 50 };

			stateManager.handleEnemyKilled(data);

			expect(updateScoreSpy).toHaveBeenCalledWith(50);
		});
	});

	describe('updateScore', () => {
		it('should update score with points multiplied by scoreMultiplier', () => {
			stateManager.state.score = 100;
			stateManager.state.scoreMultiplier = 2;

			stateManager.updateScore(50);

			expect(stateManager.state.score).toBe(200);
		});

		it('should emit SCORE_CHANGED event with correct data', () => {
			stateManager.state.score = 100;
			stateManager.state.scoreMultiplier = 2;

			stateManager.updateScore(50);

			expect(stateManager.emitGame).toHaveBeenCalledWith(GAME_EVENTS.SCORE_CHANGED, {
				amount: 50,
				newScore: 200,
			});
		});
	});

	describe('handleMultiplierChanged', () => {
		it('should update scoreMultiplier from data', () => {
			stateManager.state.scoreMultiplier = 1;
			const data = { multiplier: 3 };

			stateManager.handleMultiplierChanged(data);

			expect(stateManager.state.scoreMultiplier).toBe(3);
		});
	});

	describe('playerHit', () => {
		it('should throw error if player not initialized', () => {
			scene.player = null;
			const data = { enemy: { baseStats: { damage: 10 } } };

			expect(() => stateManager.playerHit(data)).toThrow('Player not initialized');
		});

		it('should call player.takeDamage with damage from enemy', () => {
			const mockPlayer = {
				takeDamage: vi.fn().mockReturnValue(10),
			};
			scene.player = mockPlayer;
			const enemy = { baseStats: { damage: 15 } };
			const data = { enemy };

			stateManager.playerHit(data);

			expect(mockPlayer.takeDamage).toHaveBeenCalledWith(15, enemy);
		});

		it('should use default damage of 10 if enemy damage is not a number', () => {
			const mockPlayer = {
				takeDamage: vi.fn().mockReturnValue(10),
			};
			scene.player = mockPlayer;
			const enemy = { baseStats: { damage: 'invalid' } };
			const data = { enemy };

			stateManager.playerHit(data);

			expect(mockPlayer.takeDamage).toHaveBeenCalledWith(10, enemy);
		});
	});

	describe('playerHeal', () => {
		it('should throw error if player not initialized', () => {
			scene.player = null;
			const data = { amount: 20 };

			expect(() => stateManager.playerHeal(data)).toThrow('Player not initialized');
		});

		it('should call player.heal with amount from data', () => {
			const mockPlayer = {
				heal: vi.fn(),
			};
			scene.player = mockPlayer;
			const data = { amount: 30 };

			stateManager.playerHeal(data);

			expect(mockPlayer.heal).toHaveBeenCalledWith(30);
		});
	});

	describe('handleGameOver', () => {
		it('should set gameOver state to true', () => {
			stateManager.state.gameOver = false;

			stateManager.handleGameOver();

			expect(stateManager.state.gameOver).toBe(true);
		});
	});

	describe('handleGameRestart', () => {
		it('should reset state when data.reset is true', () => {
			scene.player = null;
			const resetSpy = vi.spyOn(stateManager, 'resetState');
			const data = { reset: true };

			stateManager.handleGameRestart(data);

			expect(resetSpy).toHaveBeenCalled();
		});

		it('should reset player when data.reset is true and player exists', () => {
			const mockPlayer = {
				reset: vi.fn(),
			};
			scene.player = mockPlayer;
			const data = { reset: true };

			stateManager.handleGameRestart(data);

			expect(mockPlayer.reset).toHaveBeenCalled();
		});

		it('should not reset if data.reset is false', () => {
			const resetSpy = vi.spyOn(stateManager, 'resetState');
			const data = { reset: false };

			stateManager.handleGameRestart(data);

			expect(resetSpy).not.toHaveBeenCalled();
		});

		it('should not throw error if player does not exist during reset', () => {
			scene.player = null;
			const data = { reset: true };

			expect(() => stateManager.handleGameRestart(data)).not.toThrow();
		});
	});
});
