import { createActionHandlers } from '../../actions/handlers.js';
import { GAME_EVENTS } from '../GameEvents.js';

const GAME_EVENT_VALUES = new Set(Object.values(GAME_EVENTS));

export function resolveGameEvent(eventKey) {
	if (!eventKey) return null;
	if (GAME_EVENTS[eventKey]) return GAME_EVENTS[eventKey];
	if (GAME_EVENT_VALUES.has(eventKey)) return eventKey;
	console.warn(`EmitEvent: Unknown game event '${eventKey}'`);
	return eventKey;
}

export function runAction(action, sprite, scene) {
	if (!action) return;
	const handler = ActionRegistry[action.type];
	if (!handler) return;
	return handler(sprite, action, scene);
}

export const ActionRegistry = createActionHandlers(resolveGameEvent, runAction);
