/**
 * Game configuration for HTML Fundamentals
 */

const GAME_CONFIG = {
	id: 'html-fundamentals',
	title: 'HTML Fundamentals',
	version: '1.0.0',

	sections: [
		{ id: 'game-intro', title: 'Introduction', type: 'intro' },
		{ id: 'lesson-1', title: 'HTML Basics', type: 'lesson' },
		{ id: 'quiz-1', title: 'HTML Structure Quiz', type: 'quiz' },
		{ id: 'lesson-2', title: 'Common HTML Elements', type: 'lesson' },
		{ id: 'practice-1', title: 'Creating HTML Structure', type: 'practice' },
		{ id: 'lesson-3', title: 'HTML Attributes', type: 'lesson' },
		{ id: 'quiz-2', title: 'Attributes Quiz', type: 'quiz' },
		{ id: 'challenge', title: 'Build a Web Page', type: 'challenge' },
		{ id: 'game-complete', title: 'Completion', type: 'complete' }
	],

	quizzes: {
		'q1': {
			question: 'What does HTML stand for?',
			correctAnswer: 'hypertext',
			feedback: {
				correct: 'Correct! HTML stands for HyperText Markup Language.',
				incorrect: 'Incorrect. HTML stands for HyperText Markup Language.'
			}
		},
		'q2': {
			question: 'Which attribute is used to provide alternative text for an image?',
			correctAnswer: 'alt',
			feedback: {
				correct: 'Correct! The alt attribute provides alternative text for images.',
				incorrect: 'Incorrect. The alt attribute is used for alternative text.'
			}
		}
	},

	practiceExercises: {
		'practice-1': {
			requirements: [
				{ element: 'h1', minCount: 1, description: 'At least one main heading' },
				{ element: 'p', minCount: 1, description: 'At least one paragraph' }
			],
			solution: `<h1>Welcome to My Page</h1>
<p>This is my first HTML page.</p>`
		}
	},

	challengeRequirements: {
		elements: [
			{ element: 'h1', minCount: 1, description: 'Main heading (h1)' },
			{ element: 'h2', minCount: 1, description: 'Subheading (h2)' },
			{ element: 'p', minCount: 1, description: 'Paragraph' },
			{ element: 'img', minCount: 1, description: 'Image with alt attribute' },
			{ element: 'a', minCount: 1, description: 'Link to a website' }
		],
		attributes: [
			{ element: 'img', attribute: 'alt', required: true },
			{ element: 'a', attribute: 'href', required: true }
		]
	},

	achievements: [
		{
			skillId: 'html',
			points: 25,
			level: 1,
			description: 'Mastered HTML basics and structure'
		},
		{
			skillId: 'web-standards',
			points: 15,
			level: 1,
			description: 'Learned HTML best practices'
		},
		{
			skillId: 'problem-solving',
			points: 10,
			level: 1,
			description: 'Completed HTML webpage challenge'
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