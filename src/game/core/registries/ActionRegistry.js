import { createActionHandlers } from '../../actions/handlers.js';
import { GAME_EVENTS } from '../GameEvents.js';
import { invariant } from '../assert.js';

const GAME_EVENT_VALUES = new Set(Object.values(GAME_EVENTS));

export function resolveGameEvent(eventKey) {
	invariant(eventKey, 'resolveGameEvent: eventKey is required');
	if (GAME_EVENTS[eventKey]) return GAME_EVENTS[eventKey];
	if (GAME_EVENT_VALUES.has(eventKey)) return eventKey;
	throw new Error(`resolveGameEvent: Unknown game event '${eventKey}'`);
}

export function runAction(action, sprite, scene) {
	invariant(action, 'runAction: action is required');
	const handler = ActionRegistry[action.type];
	invariant(handler, `runAction: Unknown action type '${action?.type}'`);
	return handler(sprite, action, scene);
}

export const ActionRegistry = createActionHandlers(resolveGameEvent, runAction);
