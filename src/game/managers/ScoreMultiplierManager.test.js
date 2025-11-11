import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScoreMultiplierManager from './ScoreMultiplierManager';
import { createMockScene } from '../../test-utils/scene.mock';
import { mockBaseManager } from '../../test-utils/basemanager.mock';
import { GAME_EVENTS } from '../core/GameEvents';

mockBaseManager();

describe('ScoreMultiplierManager', () => {
	let manager;
	let scene;
	let mockTimer;

	beforeEach(() => {
		mockTimer = {
			delay: 5000,
			elapsed: 0,
			paused: false,
			remove: vi.fn(),
		};

		scene = createMockScene({
			time: {
				delayedCall: vi.fn(() => mockTimer),
			},
		});
		manager = new ScoreMultiplierManager(scene);
	});

	it('should initialize with correct properties', () => {
		expect(manager.scene).toBe(scene);
		expect(manager.combo).toBe(0);
		expect(manager.multiplier).toBe(1);
		expect(manager.comboTimer).toBeNull();
		expect(manager.freezeEvent).toBeNull();
	});

	it('should subscribe to correct events', () => {
		expect(scene.events.on).toHaveBeenCalledWith(
			GAME_EVENTS.ENEMY_KILLED,
			manager.incrementCombo,
			manager
		);
		expect(scene.events.on).toHaveBeenCalledWith(
			GAME_EVENTS.MULTIPLIER_BOOST_COLLECTED,
			manager.handleBoostCollected,
			manager
		);
		expect(scene.game.events.on).toHaveBeenCalledWith(
			GAME_EVENTS.GAME_OVER,
			manager.handleGameRestart,
			manager
		);
	});

	describe('incrementCombo', () => {
		it('should increment combo by 1', () => {
			manager.incrementCombo();
			expect(manager.combo).toBe(1);

			manager.incrementCombo();
			expect(manager.combo).toBe(2);
		});

		it('should emit COMBO_CHANGED event', () => {
			manager.incrementCombo();

			expect(scene.events.emit).toHaveBeenCalledWith(GAME_EVENTS.COMBO_CHANGED, {
				combo: 1,
			});
		});

		it('should call updateMultiplier', () => {
			const updateSpy = vi.spyOn(manager, 'updateMultiplier');
			manager.incrementCombo();

			expect(updateSpy).toHaveBeenCalled();
		});

		it('should reset combo timer', () => {
			const resetSpy = vi.spyOn(manager, 'resetComboTimer');
			manager.incrementCombo();

			expect(resetSpy).toHaveBeenCalled();
		});
	});

	describe('updateMultiplier', () => {
		it('should keep multiplier at 1 for combos below 5', () => {
			manager.combo = 0;
			manager.updateMultiplier();
			expect(manager.multiplier).toBe(1);

			manager.combo = 4;
			manager.updateMultiplier();
			expect(manager.multiplier).toBe(1);
		});

		it('should increase multiplier at combo milestones', () => {
			manager.combo = 5;
			manager.updateMultiplier();
			expect(manager.multiplier).toBe(1.5);

			manager.combo = 10;
			manager.updateMultiplier();
			expect(manager.multiplier).toBe(2);

			manager.combo = 15;
			manager.updateMultiplier();
			expect(manager.multiplier).toBe(2.5);

			manager.combo = 20;
			manager.updateMultiplier();
			expect(manager.multiplier).toBe(3);
		});

		it('should emit MULTIPLIER_CHANGED event', () => {
			manager.combo = 5;
			manager.updateMultiplier();

			expect(scene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.MULTIPLIER_CHANGED, {
				multiplier: 1.5,
			});
		});
	});

	describe('resetComboTimer', () => {
		it('should remove existing timer before creating new one', () => {
			manager.comboTimer = mockTimer;
			manager.resetComboTimer();

			expect(mockTimer.remove).toHaveBeenCalled();
		});

		it('should create new timer with correct window', () => {
			manager.combo = 0;
			manager.resetComboTimer();

			expect(scene.time.delayedCall).toHaveBeenCalledWith(5000, expect.any(Function));
		});

		it('should pause timer if freeze event is active', () => {
			manager.freezeEvent = { remove: vi.fn() };
			manager.resetComboTimer();

			expect(manager.comboTimer.paused).toBe(true);
		});

		it('should not pause timer if no freeze event', () => {
			manager.freezeEvent = null;
			manager.resetComboTimer();

			expect(manager.comboTimer.paused).toBe(false);
		});
	});

	describe('getComboWindow', () => {
		it('should return base window for low combos', () => {
			manager.combo = 0;
			expect(manager.getComboWindow()).toBe(5000);

			manager.combo = 4;
			expect(manager.getComboWindow()).toBe(5000);
		});

		it('should decrease window at milestones', () => {
			manager.combo = 5;
			expect(manager.getComboWindow()).toBe(4800);

			manager.combo = 10;
			expect(manager.getComboWindow()).toBe(4600);

			manager.combo = 15;
			expect(manager.getComboWindow()).toBe(4400);
		});

		it('should not go below minimum window', () => {
			manager.combo = 100;
			expect(manager.getComboWindow()).toBe(2000);
		});
	});

	describe('breakCombo', () => {
		it('should emit COMBO_BROKEN event if combo was active', () => {
			manager.combo = 10;
			manager.breakCombo();

			expect(scene.events.emit).toHaveBeenCalledWith(GAME_EVENTS.COMBO_BROKEN, {
				lastCombo: 10,
			});
		});

		it('should not emit COMBO_BROKEN if combo was 0', () => {
			manager.combo = 0;
			manager.breakCombo();

			expect(scene.events.emit).not.toHaveBeenCalledWith(
				GAME_EVENTS.COMBO_BROKEN,
				expect.anything()
			);
		});

		it('should reset combo and multiplier to defaults', () => {
			manager.combo = 15;
			manager.multiplier = 2.5;
			manager.breakCombo();

			expect(manager.combo).toBe(0);
			expect(manager.multiplier).toBe(1);
		});

		it('should emit COMBO_CHANGED and MULTIPLIER_CHANGED events', () => {
			manager.combo = 10;
			manager.breakCombo();

			expect(scene.events.emit).toHaveBeenCalledWith(GAME_EVENTS.COMBO_CHANGED, {
				combo: 0,
			});
			expect(scene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.MULTIPLIER_CHANGED, {
				multiplier: 1,
			});
		});

		it('should clear combo timer', () => {
			manager.comboTimer = mockTimer;
			manager.breakCombo();

			expect(manager.comboTimer).toBeNull();
		});

		it('should remove freeze event if active', () => {
			const freezeEvent = { remove: vi.fn() };
			manager.freezeEvent = freezeEvent;
			manager.breakCombo();

			expect(freezeEvent.remove).toHaveBeenCalled();
			expect(manager.freezeEvent).toBeNull();
		});
	});

	describe('handleBoostCollected', () => {
		it('should increase combo based on boost value', () => {
			manager.combo = 0;
			manager.handleBoostCollected({ boost: 1, duration: 3000 });

			expect(manager.combo).toBe(10);
		});

		it('should round up combo increase correctly', () => {
			manager.combo = 0;
			manager.handleBoostCollected({ boost: 0.7, duration: 3000 });

			expect(manager.combo).toBe(10);
		});

		it('should update multiplier and emit events', () => {
			const updateSpy = vi.spyOn(manager, 'updateMultiplier');
			manager.handleBoostCollected({ boost: 1, duration: 3000 });

			expect(updateSpy).toHaveBeenCalled();
			expect(scene.events.emit).toHaveBeenCalledWith(GAME_EVENTS.COMBO_CHANGED, {
				combo: 10,
			});
		});

		it('should pause combo timer during boost', () => {
			manager.handleBoostCollected({ boost: 1, duration: 3000 });

			expect(manager.comboTimer.paused).toBe(true);
		});

		it('should remove existing freeze event before creating new one', () => {
			const oldFreeze = { remove: vi.fn() };
			manager.freezeEvent = oldFreeze;
			manager.handleBoostCollected({ boost: 1, duration: 3000 });

			expect(oldFreeze.remove).toHaveBeenCalled();
		});

		it('should create freeze event with correct duration', () => {
			manager.handleBoostCollected({ boost: 1, duration: 3000 });

			expect(scene.time.delayedCall).toHaveBeenCalledWith(3000, expect.any(Function));
		});

		it('should unpause timer when freeze expires', () => {
			let freezeCallback;
			scene.time.delayedCall.mockImplementation((duration, callback) => {
				if (duration === 3000) {
					freezeCallback = callback;
					return { remove: vi.fn() };
				}
				return mockTimer;
			});

			manager.handleBoostCollected({ boost: 1, duration: 3000 });
			expect(manager.comboTimer.paused).toBe(true);

			freezeCallback();
			expect(manager.comboTimer.paused).toBe(false);
			expect(manager.freezeEvent).toBeNull();
		});
	});

	describe('handleGameRestart', () => {
		it('should reset when data.reset is true', () => {
			const resetSpy = vi.spyOn(manager, 'reset');
			manager.handleGameRestart({ reset: true });

			expect(resetSpy).toHaveBeenCalled();
		});

		it('should not reset when data.reset is false', () => {
			const resetSpy = vi.spyOn(manager, 'reset');
			manager.handleGameRestart({ reset: false });

			expect(resetSpy).not.toHaveBeenCalled();
		});

		it('should not reset when data is undefined', () => {
			const resetSpy = vi.spyOn(manager, 'reset');
			manager.handleGameRestart();

			expect(resetSpy).not.toHaveBeenCalled();
		});
	});

	describe('reset', () => {
		it('should remove combo timer if active', () => {
			manager.comboTimer = mockTimer;
			manager.reset();

			expect(mockTimer.remove).toHaveBeenCalled();
			expect(manager.comboTimer).toBeNull();
		});

		it('should remove freeze event if active', () => {
			const freezeEvent = { remove: vi.fn() };
			manager.freezeEvent = freezeEvent;
			manager.reset();

			expect(freezeEvent.remove).toHaveBeenCalled();
			expect(manager.freezeEvent).toBeNull();
		});

		it('should reset combo and multiplier', () => {
			manager.combo = 25;
			manager.multiplier = 3.5;
			manager.reset();

			expect(manager.combo).toBe(0);
			expect(manager.multiplier).toBe(1);
		});
	});

	describe('getActiveWindowMs', () => {
		it('should return 0 if no timer active', () => {
			manager.comboTimer = null;
			expect(manager.getActiveWindowMs()).toBe(0);
		});

		it('should return timer delay if timer active', () => {
			manager.comboTimer = mockTimer;
			expect(manager.getActiveWindowMs()).toBe(5000);
		});
	});

	describe('isFrozen', () => {
		it('should return false if no freeze event', () => {
			manager.freezeEvent = null;
			expect(manager.isFrozen()).toBe(false);
		});

		it('should return true if freeze event active', () => {
			manager.freezeEvent = { remove: vi.fn() };
			expect(manager.isFrozen()).toBe(true);
		});
	});

	describe('isTimerActive', () => {
		it('should return false if no timer', () => {
			manager.comboTimer = null;
			expect(manager.isTimerActive()).toBe(false);
		});

		it('should return true if timer active', () => {
			manager.comboTimer = mockTimer;
			expect(manager.isTimerActive()).toBe(true);
		});
	});

	describe('getTimerSnapshot', () => {
		it('should return zeros if no timer', () => {
			manager.comboTimer = null;
			expect(manager.getTimerSnapshot()).toEqual({
				totalMs: 0,
				remainingMs: 0,
			});
		});

		it('should return correct snapshot if timer active', () => {
			mockTimer.elapsed = 1000;
			manager.comboTimer = mockTimer;

			expect(manager.getTimerSnapshot()).toEqual({
				totalMs: 5000,
				remainingMs: 4000,
			});
		});

		it('should not return negative remaining time', () => {
			mockTimer.elapsed = 6000;
			manager.comboTimer = mockTimer;

			expect(manager.getTimerSnapshot().remainingMs).toBe(0);
		});
	});

	describe('destroy', () => {
		it('should remove combo timer', () => {
			manager.comboTimer = mockTimer;
			manager.destroy();

			expect(mockTimer.remove).toHaveBeenCalled();
		});

		it('should remove freeze event', () => {
			const freezeEvent = { remove: vi.fn() };
			manager.freezeEvent = freezeEvent;
			manager.destroy();

			expect(freezeEvent.remove).toHaveBeenCalled();
			expect(manager.freezeEvent).toBeNull();
		});
	});
});
