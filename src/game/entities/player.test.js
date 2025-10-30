import { describe, it, expect, vi, beforeEach } from 'vitest';
import mockPhaser from '../../test-utils/phaser.mock.js';
import Player from './player.js';
import { GAME_EVENTS } from '../core/GameEvents';

mockPhaser();

vi.mock('../core/constants', () => ({
	gameSettings: {
		SPRITE_SCALE: 3,
	},
}));

vi.mock('../util/floatingText', () => ({
	spawnFloatingText: vi.fn(),
}));

describe('Player', () => {
	let mockScene;
	let player;

	beforeEach(() => {
		mockScene = {
			add: {
				existing: vi.fn(),
			},
			physics: {
				add: {
					existing: vi.fn(),
				},
			},
			time: {
				delayedCall: vi.fn((delay, callback) => callback()),
			},
			tweens: {
				add: vi.fn(),
			},
			game: {
				events: {
					emit: vi.fn(),
				},
			},
		};

		player = new Player(mockScene, 100, 100);
	});

	describe('constructor', () => {
		it('should initialize with correct default values', () => {
			expect(player.maxHealth).toBe(100);
			expect(player.health).toBe(100);
			expect(player.shield).toBe(0);
			expect(player.maxShield).toBe(30);
			expect(player.immunity).toBe(false);
			expect(player.immunityLength).toBe(1000);
		});

		it('should add itself to the scene', () => {
			expect(mockScene.add.existing).toHaveBeenCalledWith(player);
			expect(mockScene.physics.add.existing).toHaveBeenCalledWith(player);
		});
	});

	describe('takeDamage', () => {
		it('should reduce health by damage amount', () => {
			const damage = player.takeDamage(20);

			expect(player.health).toBe(80);
			expect(damage).toBe(20);
		});

		it('should not reduce health when immune', () => {
			player.immunity = true;
			player.takeDamage(20);

			expect(player.health).toBe(100);
		});

		it('should grant immunity after taking damage', () => {
			player.takeDamage(20);

			expect(player.immunity).toBe(false);
		});

		it('should use shield before health', () => {
			player.shield = 15;
			const damage = player.takeDamage(20);

			expect(player.shield).toBe(0);
			expect(player.health).toBe(95);
			expect(damage).toBe(5);
		});

		it('should fully absorb damage with shield', () => {
			player.shield = 30;
			const damage = player.takeDamage(20);

			expect(player.shield).toBe(10);
			expect(player.health).toBe(100);
			expect(damage).toBe(0);
		});

		it('should not reduce health below 0', () => {
			player.takeDamage(150);

			expect(player.health).toBe(0);
		});

		it('should emit HEALTH_CHANGED event', () => {
			player.takeDamage(20);

			expect(mockScene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.HEALTH_CHANGED, {
				currentHealth: 80,
				maxHealth: 100,
			});
		});

		it('should emit SHIELD_CHANGED event', () => {
			player.shield = 10;
			player.takeDamage(20);

			expect(mockScene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.SHIELD_CHANGED, {
				shield: 0,
			});
		});

		it('should call die when health reaches 0', () => {
			const dieSpy = vi.spyOn(player, 'die');
			player.takeDamage(100);

			expect(dieSpy).toHaveBeenCalled();
		});

		it('should use default damage of 10 for invalid amount', () => {
			player.takeDamage('invalid');

			expect(player.health).toBe(90);
		});

		it('should call playHitEffect with immunity length', () => {
			const hitEffectSpy = vi.spyOn(player, 'playHitEffect');
			player.takeDamage(20);

			expect(hitEffectSpy).toHaveBeenCalledWith(1000);
		});
	});

	describe('heal', () => {
		it('should increase health by heal amount', () => {
			player.health = 50;
			const actualHeal = player.heal(30);

			expect(player.health).toBe(80);
			expect(actualHeal).toBe(30);
		});

		it('should not exceed max health', () => {
			player.health = 90;
			const actualHeal = player.heal(30);

			expect(player.health).toBe(100);
			expect(actualHeal).toBe(10);
		});

		it('should return 0 when already at max health', () => {
			player.health = 100;
			const actualHeal = player.heal(20);

			expect(player.health).toBe(100);
			expect(actualHeal).toBe(0);
		});

		it('should emit HEALTH_CHANGED event', () => {
			player.health = 50;
			player.heal(30);

			expect(mockScene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.HEALTH_CHANGED, {
				currentHealth: 80,
				maxHealth: 100,
			});
		});

		it('should use default heal of 0 for invalid amount', () => {
			player.health = 50;
			player.heal('invalid');

			expect(player.health).toBe(50);
		});
	});

	describe('applyShield', () => {
		it('should increase shield by shield amount', () => {
			const actualShield = player.applyShield(20);

			expect(player.shield).toBe(20);
			expect(actualShield).toBe(20);
		});

		it('should not exceed max shield', () => {
			player.shield = 25;
			const actualShield = player.applyShield(10);

			expect(player.shield).toBe(30);
			expect(actualShield).toBe(5);
		});

		it('should return 0 when already at max shield', () => {
			player.shield = 30;
			const actualShield = player.applyShield(10);

			expect(player.shield).toBe(30);
			expect(actualShield).toBe(0);
		});

		it('should emit SHIELD_CHANGED event', () => {
			player.applyShield(20);

			expect(mockScene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.SHIELD_CHANGED, {
				shield: 20,
			});
		});

		it('should use default shield of 0 for invalid amount', () => {
			player.applyShield('invalid');

			expect(player.shield).toBe(0);
		});
	});

	describe('increaseMaxHealth', () => {
		it('should increase max health', () => {
			player.increaseMaxHealth(20);

			expect(player.maxHealth).toBe(120);
		});

		it('should increase current health if specified', () => {
			player.health = 100;
			player.increaseMaxHealth(20, 15);

			expect(player.maxHealth).toBe(120);
			expect(player.health).toBe(115);
		});

		it('should emit HEALTH_CHANGED event', () => {
			player.increaseMaxHealth(20, 10);

			expect(mockScene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.HEALTH_CHANGED, {
				currentHealth: 110,
				maxHealth: 120,
			});
		});
	});

	describe('die', () => {
		it('should emit GAME_OVER event', () => {
			player.die();

			expect(mockScene.game.events.emit).toHaveBeenCalledWith(GAME_EVENTS.GAME_OVER);
		});
	});

	describe('reset', () => {
		it('should reset player to default values', () => {
			player.health = 50;
			player.maxHealth = 150;
			player.shield = 20;
			player.immunity = true;
			player.setAlpha = vi.fn();

			player.reset();

			expect(player.health).toBe(100);
			expect(player.maxHealth).toBe(100);
			expect(player.shield).toBe(0);
			expect(player.immunity).toBe(false);
			expect(player.setAlpha).toHaveBeenCalledWith(1);
		});
	});

	describe('playHitEffect', () => {
		it('should create a tween for hit effect', () => {
			player.playHitEffect(1000);

			expect(mockScene.tweens.add).toHaveBeenCalledWith(
				expect.objectContaining({
					targets: player,
					alpha: 0.3,
					duration: 100,
					yoyo: true,
				})
			);
		});
	});
});
