export const GAME_EVENTS = {
	KEY_PRESSED: 'input:key_pressed',

	ENEMY_SPAWNED: 'combat:enemy_spawned',
	ENEMY_KILLED: 'combat:enemy_killed',
	SPAWN_ENEMIES: 'combat:spawn_enemies',

	SCORE_CHANGED: 'game:score_changed',
	MULTIPLIER_CHANGED: 'game:multiplier_changed',
	MULTIPLIER_BOOST_COLLECTED: 'game:multiplier_boost_collected',
	COMBO_CHANGED: 'game:combo_changed',
	COMBO_BROKEN: 'game:combo_broken',
	HEALTH_CHANGED: 'game:health_changed',
	SHIELD_CHANGED: 'game:shield_changed',
	PLAYER_HIT: 'game:player_hit',
	WAVE_STARTED: 'game:wave_started',
	WAVE_SPAWN_ENEMIES: 'wave:spawn_enemies',
	WAVE_SPAWN_ITEMS: 'wave:spawn_items',
	GAME_OVER: 'game:game_over',

	WEAPON_READY_TO_FIRE: 'weapon:ready_to_fire',
	WEAPON_FIRED: 'weapon:fired',
	WEAPON_EQUIPPED: 'weapon:equipped',
	WEAPON_AMMO_CHANGED: 'weapon:ammo_changed',
	TARGETS_SELECTED: 'weapon:targets_selected',
	RANDOM_WEAPON_REQUESTED: 'weapon:random_requested',

	ITEM_SPAWNED: 'item:item_spawn',

	ENVIRONMENTAL_EFFECT_ACTIVATE: 'environment:effect_activate',
};
