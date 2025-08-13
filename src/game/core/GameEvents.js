export const GAME_EVENTS = {
	KEY_PRESSED: 'input:key_pressed',

	PROJECTILE_HIT: 'combat:projectile_hit',
	ENEMY_SPAWNED: 'combat:enemy_spawned',
	ENEMY_KILLED: 'combat:enemy_killed',

	LETTER_TYPED: 'typing:letter_typed',
	TYPING_INPUT: 'typing:input',

	SCORE_CHANGED: 'game:score_changed',
	HEALTH_CHANGED: 'game:health_changed',
	PLAYER_HIT: 'game:player_hit',
	PLAYER_HEALED: 'game:player_healed',
	WAVE_STARTED: 'game:wave_started',
	WAVE_COMPLETED: 'game:wave_completed',
	WAVE_SPAWN_ENEMIES: 'wave:spawn_enemies',
	WAVE_SPAWN_ITEMS: 'wave:spawn_items',
	GAME_OVER: 'game:game_over',

	WEAPON_SWITCH: 'weapon:switch',
	WEAPON_FIRE: 'weapon:fire',
	WEAPON_FIRED: 'weapon:fired',
	WEAPON_EQUIPPED: 'weapon:equipped',

	ITEM_SPAWNED: 'item:item_spawn',
	ITEM_COLLECTED: 'item:collected',
	SCENE_READY: 'system:scene_ready',
	PROJECTILES_READY: 'system:projectiles_ready',
};
