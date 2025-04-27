/**
 * Game configuration for CSS Styling
 */

const GAME_CONFIG = {
	id: 'css-styling',
	title: 'CSS Styling',
	version: '1.0.0',

	sections: [
		{ id: 'game-intro', title: 'Introduction', type: 'intro' },
		{ id: 'lesson-1', title: 'CSS Basics', type: 'lesson' },
		{ id: 'quiz-1', title: 'CSS Fundamentals Quiz', type: 'quiz' },
		{ id: 'lesson-2', title: 'Selectors and Properties', type: 'lesson' },
		{ id: 'practice-1', title: 'Basic Styling', type: 'practice' },
		{ id: 'lesson-3', title: 'Box Model and Layout', type: 'lesson' },
		{ id: 'quiz-2', title: 'Box Model Quiz', type: 'quiz' },
		{ id: 'challenge', title: 'Style a Web Page', type: 'challenge' },
		{ id: 'game-complete', title: 'Completion', type: 'complete' }
	],

	quizzes: {
		'q1': {
			question: 'What does CSS stand for?',
			correctAnswer: 'cascading',
			feedback: {
				correct: 'Correct! CSS stands for Cascading Style Sheets.',
				incorrect: 'Incorrect. CSS stands for Cascading Style Sheets.'
			}
		},
		'q2': {
			question: 'Which CSS property controls the space between an element\'s content and its border?',
			correctAnswer: 'padding',
			feedback: {
				correct: 'Correct! Padding is the space between content and border.',
				incorrect: 'Incorrect. Padding controls the space between content and border.'
			}
		}
	},

	practiceExercises: {
		'practice-1': {
			requirements: [
				{
					selector: 'h1',
					properties: ['color'],
					values: { color: 'blue' },
					description: 'Heading should be blue'
				},
				{
					selector: 'p',
					properties: ['font-size'],
					values: { 'font-size': '16px' },
					description: 'Paragraph font size should be 16px'
				},
				{
					selector: 'div',
					properties: ['border'],
					values: { border: /red/ },
					description: 'Div should have a red border'
				}
			],
			solution: `h1 {
    color: blue;
}

p {
    font-size: 16px;
}

div {
    border: 1px solid red;
}`
		}
	},

	challengeRequirements: {
		selectors: [
			{ selector: 'body', required: true },
			{ selector: '.container', required: true },
			{ selector: '.card', required: true },
			{ selector: '.btn', required: true }
		],
		properties: {
			'body': ['background-color'],
			'h1': ['font-size', 'color'],
			'.card': ['padding', 'margin', 'border'],
			'.btn': ['background-color', 'color', 'padding'],
			'.btn:hover': ['background-color']
		},
		layoutFeatures: ['flexbox']
	},

	achievements: [
		{
			skillId: 'css',
			points: 25,
			level: 1,
			description: 'Mastered CSS basics and styling'
		},
		{
			skillId: 'web-standards',
			points: 15,
			level: 1,
			description: 'Learned CSS layout principles'
		},
		{
			skillId: 'problem-solving',
			points: 10,
			level: 1,
			description: 'Completed CSS styling challenge'
		}
	],

	completionRequirements: {
		minimumScore: 80,
		requiredSections: ['quiz-1', 'practice-1', 'quiz-2', 'challenge']
	}
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = GAME_CONFIG;
}