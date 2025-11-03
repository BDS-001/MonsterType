import { describe, it, expect, vi, beforeEach } from 'vitest';
import WaveManager from './WaveManager.js';
import { createMockScene } from '../../test-utils/scene.mock.js';
import { GAME_EVENTS } from '../core/GameEvents.js';
import waves from '../data/waves.json';

vi.mock('../core/BaseManager.js', () => ({
	default: class BaseManager {
		constructor(scene) {
			this.scene = scene;
		}
		subscribe() {}
		emit() {}
		emitGame() {}
		destroy() {}
	},
}));

describe('WaveManager', () => {
	let mockScene;
	let waveManager;

	beforeEach(() => {
		mockScene = createMockScene();
		waveManager = new WaveManager(mockScene);
		waveManager.emit = vi.fn();
		waveManager.emitGame = vi.fn();
	});

	describe('initialization', () => {
		it('should initialize with wave 1 and 0 enemies alive', () => {
			expect(waveManager.currentWave).toBe(1);
			expect(waveManager.enemiesAlive).toBe(0);
		});

		it('should setup event listeners', () => {
			expect(waveManager.subscribe).toBeDefined();
		});
	});

	describe('handleEnemySpawned', () => {
		it('should increment enemiesAlive counter', () => {
			waveManager.handleEnemySpawned();
			expect(waveManager.enemiesAlive).toBe(1);

			waveManager.handleEnemySpawned();
			expect(waveManager.enemiesAlive).toBe(2);
		});
	});

	describe('handleEnemyKilled', () => {
		it('should decrement enemiesAlive counter', () => {
			waveManager.enemiesAlive = 3;

			waveManager.handleEnemyKilled();
			expect(waveManager.enemiesAlive).toBe(2);
		});

		it('should trigger wave complete when all enemies killed', () => {
			waveManager.enemiesAlive = 1;
			waveManager.onWaveComplete = vi.fn();

			waveManager.handleEnemyKilled();

			expect(waveManager.enemiesAlive).toBe(0);
			expect(waveManager.onWaveComplete).toHaveBeenCalled();
		});

		it('should trigger wave complete when enemiesAlive goes below 0', () => {
			waveManager.enemiesAlive = 0;
			waveManager.onWaveComplete = vi.fn();

			waveManager.handleEnemyKilled();

			expect(waveManager.enemiesAlive).toBe(-1);
			expect(waveManager.onWaveComplete).toHaveBeenCalled();
		});

		it('should not trigger wave complete when enemies remain', () => {
			waveManager.enemiesAlive = 5;
			waveManager.onWaveComplete = vi.fn();

			waveManager.handleEnemyKilled();

			expect(waveManager.enemiesAlive).toBe(4);
			expect(waveManager.onWaveComplete).not.toHaveBeenCalled();
		});
	});

	describe('getWaveData', () => {
		it('should return configured wave data for existing waves', () => {
			const waveData = waveManager.getWaveData(1);

			expect(waveData).toEqual(waves['1']);
		});

		it('should return configured wave data for wave 2', () => {
			const waveData = waveManager.getWaveData(2);

			expect(waveData).toEqual(waves['2']);
		});

		it('should return configured wave data for wave 30', () => {
			const waveData = waveManager.getWaveData(30);

			expect(waveData).toEqual(waves['30']);
		});

		it('should generate dynamic wave data for wave 31', () => {
			const waveData = waveManager.getWaveData(31);

			expect(waveData.enemies).toBeDefined();
			expect(waveData.items).toBeDefined();
			expect(waveData.enemies.zombie).toEqual({ count: 46 });
			expect(waveData.enemies.ghost).toEqual({ count: 18 });
			expect(waveData.enemies.mummy).toEqual({ count: 7 });
			expect(waveData.enemies.slime).toEqual({ count: 3 });
		});

		it('should generate dynamic wave data for unconfigured waves', () => {
			const waveData = waveManager.getWaveData(100);

			expect(waveData.enemies).toBeDefined();
			expect(waveData.items).toBeDefined();
			expect(waveData.enemies.zombie).toBeDefined();
			expect(waveData.enemies.ghost).toBeDefined();
			expect(waveData.enemies.mummy).toBeDefined();
			expect(waveData.enemies.slime).toBeDefined();
		});
	});

	describe('calculateDynamicEnemies', () => {
		it('should calculate enemy counts for wave 10', () => {
			const enemies = waveManager.calculateDynamicEnemies(10);

			expect(enemies).toEqual({
				zombie: { count: 20 },
				ghost: { count: 10 },
				mummy: { count: 3 },
				slime: { count: 1 },
			});
		});

		it('should calculate enemy counts for wave 50', () => {
			const enemies = waveManager.calculateDynamicEnemies(50);

			expect(enemies).toEqual({
				zombie: { count: 75 },
				ghost: { count: 30 },
				mummy: { count: 12 },
				slime: { count: 5 },
			});
		});

		it('should enforce minimum enemy counts for low waves', () => {
			const enemies = waveManager.calculateDynamicEnemies(1);

			expect(enemies.zombie.count).toBeGreaterThanOrEqual(20);
			expect(enemies.ghost.count).toBeGreaterThanOrEqual(10);
			expect(enemies.mummy.count).toBeGreaterThanOrEqual(3);
			expect(enemies.slime.count).toBeGreaterThanOrEqual(1);
		});
	});

	describe('calculateDynamicItems', () => {
		it('should return empty items for non-milestone waves', () => {
			const items = waveManager.calculateDynamicItems(31);
			expect(items).toEqual({});
		});

		it('should return HEALTH_UP for wave 40', () => {
			const items = waveManager.calculateDynamicItems(40);
			expect(items.HEALTH_UP).toBe(2);
		});

		it('should return HEALTH_UP for wave 50', () => {
			const items = waveManager.calculateDynamicItems(50);
			expect(items.HEALTH_UP).toBe(2);
		});

		it('should return HEALTH_UP for wave 60', () => {
			const items = waveManager.calculateDynamicItems(60);
			expect(items.HEALTH_UP).toBe(3);
		});

		it('should cap HEALTH_UP at 3', () => {
			const items = waveManager.calculateDynamicItems(100);
			expect(items.HEALTH_UP).toBe(3);
		});

		it('should not spawn items for wave 35', () => {
			const items = waveManager.calculateDynamicItems(35);
			expect(items).toEqual({});
		});
	});

	describe('startWave', () => {
		it('should set current wave number', () => {
			waveManager.startWave(5);
			expect(waveManager.currentWave).toBe(5);
		});

		it('should reset enemiesAlive counter', () => {
			waveManager.enemiesAlive = 10;
			waveManager.startWave(2);
			expect(waveManager.enemiesAlive).toBe(0);
		});

		it('should emit WAVE_STARTED event', () => {
			waveManager.startWave(3);

			expect(waveManager.emitGame).toHaveBeenCalledWith(GAME_EVENTS.WAVE_STARTED, {
				waveNumber: 3,
			});
		});

		it('should emit SPAWN_ENEMIES event with wave data', () => {
			waveManager.startWave(1);

			expect(waveManager.emit).toHaveBeenCalledWith(GAME_EVENTS.SPAWN_ENEMIES, waves['1'].enemies);
		});

		it('should emit WAVE_SPAWN_ITEMS event with wave data', () => {
			waveManager.startWave(1);

			expect(waveManager.emit).toHaveBeenCalledWith(GAME_EVENTS.WAVE_SPAWN_ITEMS, waves['1'].items);
		});

		it('should emit all events in correct order', () => {
			waveManager.startWave(2);

			expect(waveManager.emitGame).toHaveBeenCalledWith(GAME_EVENTS.WAVE_STARTED, {
				waveNumber: 2,
			});
			expect(waveManager.emit).toHaveBeenCalledWith(GAME_EVENTS.SPAWN_ENEMIES, waves['2'].enemies);
			expect(waveManager.emit).toHaveBeenCalledWith(GAME_EVENTS.WAVE_SPAWN_ITEMS, waves['2'].items);
		});
	});

	describe('onWaveComplete', () => {
		it('should start next wave', () => {
			waveManager.currentWave = 3;
			waveManager.startWave = vi.fn();

			waveManager.onWaveComplete();

			expect(waveManager.startWave).toHaveBeenCalledWith(4);
		});

		it('should increment wave from 1 to 2', () => {
			waveManager.currentWave = 1;
			waveManager.startWave = vi.fn();

			waveManager.onWaveComplete();

			expect(waveManager.startWave).toHaveBeenCalledWith(2);
		});
	});

	describe('startWaves', () => {
		it('should start wave 1', () => {
			waveManager.startWave = vi.fn();

			waveManager.startWaves();

			expect(waveManager.startWave).toHaveBeenCalledWith(1);
		});
	});

	describe('destroy', () => {
		it('should call super destroy', () => {
			const destroySpy = vi.spyOn(Object.getPrototypeOf(WaveManager.prototype), 'destroy');

			waveManager.destroy();

			expect(destroySpy).toHaveBeenCalled();
		});
	});
});
