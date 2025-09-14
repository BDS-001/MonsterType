export const FONT_CONFIG = {
	NAME: 'Silkscreen',
	FAMILY: 'Silkscreen, monospace',
	PATH: 'fonts/Silkscreen/Silkscreen-Regular.ttf',
	FORMAT: 'truetype',
};

export const FONTS = {
	PRIMARY: FONT_CONFIG.FAMILY,
};
export const TEXT_STYLES = {
	UI_LARGE: {
		fontFamily: FONTS.PRIMARY,
		fontSize: '48px',
		fill: '#ffffff',
		stroke: '#000000',
		strokeThickness: 4,
		fontStyle: 'bold',
	},
	UI_MEDIUM: {
		fontFamily: FONTS.PRIMARY,
		fontSize: '24px',
		fill: '#ffffff',
		stroke: '#000000',
		strokeThickness: 2,
		fontStyle: 'bold',
	},
	UI_SMALL: {
		fontFamily: FONTS.PRIMARY,
		fontSize: '20px',
		fill: '#ffffff',
		stroke: '#000000',
		strokeThickness: 2,
		fontStyle: 'bold',
	},
	UI_TINY: {
		fontFamily: FONTS.PRIMARY,
		fontSize: '18px',
		fill: '#ffffff',
		stroke: '#000000',
		strokeThickness: 2,
		fontStyle: 'bold',
	},
	ENTITY_WORD: {
		fontFamily: FONTS.PRIMARY,
		fontSize: '28px',
		color: '#ffffff',
	},
	FPS_COUNTER: {
		font: `16px ${FONTS.PRIMARY}`,
		fill: '#00ff00',
	},
};
