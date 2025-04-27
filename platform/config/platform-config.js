/**
 * Platform configuration file
 */

const PLATFORM_CONFIG = {
	// Available games
	GAMES: {
		'internet-basics': {
			id: 'internet-basics',
			title: 'The Internet Basics',
			icon: '🌐',
			path: 'games/internet-basics/',
			prerequisites: [],
			skills: ['internet', 'networking', 'problem-solving'],
			difficulty: 'beginner'
		},
		'html-fundamentals': {
			id: 'html-fundamentals',
			title: 'HTML Fundamentals',
			icon: '📄',
			path: 'games/html-fundamentals/',
			prerequisites: ['internet-basics'],
			skills: ['html', 'web-standards'],
			difficulty: 'beginner'
		},
		'css-styling': {
			id: 'css-styling',
			title: 'CSS Styling',
			icon: '🎨',
			path: 'games/css-styling/',
			prerequisites: ['internet-basics', 'html-fundamentals'],
			skills: ['css', 'web-standards'],
			difficulty: 'beginner'
		},
		'javascript-basics': {
			id: 'javascript-basics',
			title: 'JavaScript Basics',
			icon: '📜',
			path: 'games/javascript-basics/',
			prerequisites: ['html-fundamentals'],
			skills: ['js', 'problem-solving'],
			difficulty: 'intermediate'
		},
		'dom-manipulation': {
			id: 'dom-manipulation',
			title: 'DOM Manipulation',
			icon: '🖱️',
			path: 'games/dom-manipulation/',
			prerequisites: ['javascript-basics'],
			skills: ['js', 'html'],
			difficulty: 'intermediate'
		},
		'web-apis': {
			id: 'web-apis',
			title: 'Web APIs',
			icon: '⚙️',
			path: 'games/web-apis/',
			prerequisites: ['javascript-basics', 'dom-manipulation'],
			skills: ['js', 'web-standards', 'networking'],
			difficulty: 'intermediate'
		}
	},

	// Learning paths
	PATHS: {
		beginner: {
			title: 'Beginner Path',
			games: ['internet-basics', 'html-fundamentals', 'css-styling'],
			color: '#3b82f6'
		},
		intermediate: {
			title: 'Intermediate Path',
			games: ['javascript-basics', 'dom-manipulation', 'web-apis'],
			color: '#f59e0b',
			prerequisite: 'beginner'
		},
		advanced: {
			title: 'Advanced Path',
			games: ['modern-frameworks', 'backend-basics', 'full-stack'],
			color: '#f43f5e',
			prerequisite: 'intermediate'
		}
	},

	// Debug configuration
	DEBUG: {
		ENABLED_BY_DEFAULT: true,
		KEYBOARD_SHORTCUT: true,
		LOG_TO_CONSOLE: true
	},

	// Storage keys
	STORAGE_KEYS: {
		STUDENT_DATA: 'studentData',
		COMPLETED_GAMES: 'completedGames',
		CURRENT_PATH: 'currentPath',
		GAME_ATTEMPTS: 'gameAttempts',
		NAVIGATION_HISTORY: 'navigationHistory'
	},

	// UI Configuration
	UI: {
		ANIMATION_DURATION: 300,
		NOTIFICATION_DURATION: 3000
	}
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = PLATFORM_CONFIG;
}