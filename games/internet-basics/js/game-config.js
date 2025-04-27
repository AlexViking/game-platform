/**
 * Game configuration for Internet Basics
 */

const GAME_CONFIG = {
	id: 'internet-basics',
	title: 'The Internet Basics',
	version: '1.0.0',

	sections: [
		{ id: 'game-intro', title: 'Introduction', type: 'intro' },
		{ id: 'lesson-1', title: 'What is the Internet?', type: 'lesson' },
		{ id: 'quiz-1', title: 'Internet Quiz', type: 'quiz' },
		{ id: 'lesson-2', title: 'How HTTP Works', type: 'lesson' },
		{ id: 'quiz-2', title: 'HTTP Quiz', type: 'quiz' },
		{ id: 'lesson-3', title: 'How Browsers Work', type: 'lesson' },
		{ id: 'interactive-demo', title: 'HTTP Simulation', type: 'interactive' },
		{ id: 'challenge', title: 'Network Troubleshooting', type: 'challenge' },
		{ id: 'game-complete', title: 'Completion', type: 'complete' }
	],

	quizzes: {
		'q1': {
			question: 'Which of these is NOT a key component of the internet?',
			correctAnswer: 'compilers',
			feedback: {
				correct: 'Correct! Compilers are used in software development, not as a component of the internet.',
				incorrect: 'Incorrect. Try again! Think about the basic components needed for internet communication.'
			}
		},
		'q2': {
			question: 'Which HTTP status code indicates a successful request?',
			correctAnswer: '200',
			feedback: {
				correct: 'Correct! 200 OK indicates a successful HTTP request.',
				incorrect: 'Incorrect. 200 is the status code for a successful request.'
			}
		}
	},

	challengeAnswer: '404',

	achievements: [
		{
			skillId: 'internet',
			points: 20,
			level: 1,
			description: 'Mastered internet basics concepts'
		},
		{
			skillId: 'networking',
			points: 15,
			level: 1,
			description: 'Learned HTTP protocol basics'
		},
		{
			skillId: 'problem-solving',
			points: 10,
			level: 1,
			description: 'Completed network troubleshooting challenge'
		}
	],

	completionRequirements: {
		minimumScore: 80,
		requiredSections: ['quiz-1', 'quiz-2', 'challenge']
	}
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = GAME_CONFIG;
}