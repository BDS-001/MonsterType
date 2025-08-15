export const GAME_EVENTS = {
	KEY_PRESSED: 'input:key_pressed',

	ENEMY_SPAWNED: 'combat:enemy_spawned',
	ENEMY_KILLED: 'combat:enemy_killed',

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
	WEAPON_READY_TO_FIRE: 'weapon:ready_to_fire',
	WEAPON_FIRED: 'weapon:fired',
	WEAPON_EQUIPPED: 'weapon:equipped',
	TARGETS_SELECTED: 'weapon:targets_selected',

	ITEM_SPAWNED: 'item:item_spawn',
	ITEM_COLLECTED: 'item:collected',
	ITEM_DESTROYED: 'item:destroyed',
	SCENE_READY: 'system:scene_ready',
};
