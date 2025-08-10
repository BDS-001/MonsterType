export const GAME_EVENTS = {
	KEY_PRESSED: 'input:key_pressed',

	PROJECTILE_FIRED: 'combat:projectile_fired',
	PROJECTILE_HIT: 'combat:projectile_hit',
	PROJECTILE_MISSED: 'combat:projectile_missed',
	ENEMY_SPAWNED: 'combat:enemy_spawned',
	ENEMY_KILLED: 'combat:enemy_killed',

	LETTER_TYPED: 'typing:letter_typed',

	SCORE_CHANGED: 'game:score_changed',
	HEALTH_CHANGED: 'game:health_changed',
	PLAYER_HIT: 'game:player_hit',
	PLAYER_HEALED: 'game:player_healed',
	WAVE_STARTED: 'game:wave_started',
	WAVE_COMPLETED: 'game:wave_completed',
	WAVE_SPAWN_ENEMIES: 'wave:spawn_enemies',
	WAVE_SPAWN_ITEMS: 'wave:spawn_items',
	GAME_OVER: 'game:game_over',

	ITEM_COLLECTED: 'item:collected',
	SCENE_READY: 'system:scene_ready',
};
