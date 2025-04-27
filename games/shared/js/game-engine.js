/**
 * Shared Game Engine
 * Handles common game functionality across all learning games
 */

class GameEngine {
	constructor() {
		this.gameState = {
			currentSection: 'game-intro',
			progress: 0,
			correctAnswers: 0,
			studentId: null,
			completedSections: [],
			startTime: Date.now(),
			platformReturnUrl: null,
			cvReturnUrl: null
		};

		this.initialize();
	}

	initialize() {
		// Load URL parameters
		this.loadUrlParameters();

		// Initialize debug mode
		window.debug.init();

		// Set up event listeners
		this.setupEventListeners();

		// Initialize first section
		this.showSection(this.gameState.currentSection);

		// Log initialization
		window.debug.log('Game engine initialized', 'info', {
			gameId: GAME_CONFIG.id,
			studentId: this.gameState.studentId
		});
	}

	loadUrlParameters() {
		const urlParams = new URLSearchParams(window.location.search);

		this.gameState.studentId = urlParams.get('student');
		this.gameState.platformReturnUrl = urlParams.get('platform_return');
		this.gameState.cvReturnUrl = urlParams.get('cv_return');

		// Check for debug mode
		if (urlParams.get('debug') === 'true') {
			window.debug.enable();
		}
	}

	setupEventListeners() {
		// Start game button
		const startButton = document.getElementById('start-game');
		if (startButton) {
			startButton.addEventListener('click', () => {
				this.showSection(GAME_CONFIG.sections[1].id);
			});
		}

		// Navigation buttons
		document.querySelectorAll('.btn-next').forEach(button => {
			button.addEventListener('click', () => {
				const nextSection = button.getAttribute('data-next');
				if (nextSection) {
					this.showSection(nextSection);
				}
			});
		});

		// Quiz check buttons
		document.querySelectorAll('.btn-check').forEach(button => {
			button.addEventListener('click', () => {
				const questionId = button.getAttribute('data-question');
				const correctAnswer = button.getAttribute('data-answer');
				this.checkQuizAnswer(questionId, correctAnswer);
			});
		});

		// Challenge check button
		const challengeButton = document.querySelector('.btn-check-challenge');
		if (challengeButton) {
			challengeButton.addEventListener('click', () => {
				this.checkChallengeAnswer();
			});
		}

		// Complete game button
		const completeButton = document.querySelector('.btn-complete');
		if (completeButton) {
			completeButton.addEventListener('click', () => {
				this.completeGame();
			});
		}

		// Copy key button
		const copyButton = document.getElementById('copy-key');
		if (copyButton) {
			copyButton.addEventListener('click', () => {
				this.copyAchievementKey();
			});
		}

		// Return to platform button
		const returnButton = document.getElementById('return-to-platform');
		if (returnButton) {
			returnButton.addEventListener('click', () => {
				this.returnToPlatform();
			});
		}

		// Debug toggle
		const debugButton = document.getElementById('debug-mode-toggle');
		if (debugButton) {
			debugButton.addEventListener('click', () => {
				window.debug.toggle();
			});
		}
	}

	showSection(sectionId) {
		// Hide all sections
		document.querySelectorAll('.game-section').forEach(section => {
			section.classList.remove('active');
		});

		// Show target section
		const targetSection = document.getElementById(sectionId);
		if (targetSection) {
			targetSection.classList.add('active');
			this.gameState.currentSection = sectionId;

			// Mark section as completed
			if (!this.gameState.completedSections.includes(sectionId)) {
				this.gameState.completedSections.push(sectionId);
			}

			// Update progress
			this.updateProgress();

			// Update debug flow
			window.debug.updateFlowState('game', 'active', `Section: ${sectionId}`);

			// Log navigation
			window.debug.log(`Navigated to section: ${sectionId}`, 'info');
		}
	}

	updateProgress() {
		const totalSections = GAME_CONFIG.sections.length;
		const currentIndex = GAME_CONFIG.sections.findIndex(
			section => section.id === this.gameState.currentSection
		);

		if (currentIndex >= 0) {
			const percentage = Math.round((currentIndex / (totalSections - 1)) * 100);

			// Update progress bar
			document.querySelector('.progress-fill').style.width = `${percentage}%`;
			document.querySelector('.progress-text').textContent = `${percentage}% Complete`;

			this.gameState.progress = percentage;
		}
	}

	checkQuizAnswer(questionId, correctAnswer) {
		const selectedInput = document.querySelector(`input[name="${questionId}"]:checked`);

		if (!selectedInput) {
			GameUtils.showNotification('Please select an answer', 'warning');
			return;
		}

		const selectedAnswer = selectedInput.value;
		const feedbackElement = selectedInput.closest('.question').querySelector('.feedback');
		const checkButton = document.querySelector(`[data-question="${questionId}"]`);
		const nextButton = checkButton.nextElementSibling;

		if (selectedAnswer === correctAnswer) {
			feedbackElement.textContent = GAME_CONFIG.quizzes[questionId].feedback.correct;
			feedbackElement.className = 'feedback correct';
			this.gameState.correctAnswers++;

			// Show next button
			checkButton.style.display = 'none';
			if (nextButton) {
				nextButton.style.display = 'inline-block';
			}

			window.debug.log(`Quiz answer correct: ${questionId}`, 'success');
		} else {
			feedbackElement.textContent = GAME_CONFIG.quizzes[questionId].feedback.incorrect;
			feedbackElement.className = 'feedback incorrect';

			window.debug.log(`Quiz answer incorrect: ${questionId}`, 'error');
		}

		feedbackElement.style.display = 'block';
	}

	checkChallengeAnswer() {
		const selectedInput = document.querySelector('input[name="challenge"]:checked');

		if (!selectedInput) {
			GameUtils.showNotification('Please select an answer', 'warning');
			return;
		}

		const selectedAnswer = selectedInput.value;
		const feedbackElement = document.querySelector('#challenge .feedback');
		const checkButton = document.querySelector('.btn-check-challenge');
		const completeButton = document.querySelector('.btn-complete');

		if (selectedAnswer === GAME_CONFIG.challengeAnswer) {
			feedbackElement.textContent = 'Correct! The 404 Not Found error indicates that the server couldn\'t find the requested resource.';
			feedbackElement.className = 'feedback correct';

			// Show complete button
			checkButton.style.display = 'none';
			completeButton.style.display = 'inline-block';

			window.debug.log('Challenge completed successfully', 'success');
		} else {
			feedbackElement.textContent = 'Incorrect. Look at the status code in the response. Try again!';
			feedbackElement.className = 'feedback incorrect';

			window.debug.log('Challenge answer incorrect', 'error');
		}

		feedbackElement.style.display = 'block';
	}

	completeGame() {
		// Generate achievement key
		const achievementKey = KeyGenerator.generateKey(
			GAME_CONFIG.id,
			GAME_CONFIG.achievements,
			this.gameState.studentId
		);

		// Display achievement key
		document.getElementById('achievement-key').textContent = achievementKey;

		// Update debug flow
		window.debug.updateFlowState('achievement', 'completed', 'Key generated');

		// Show completion section
		this.showSection('game-complete');

		window.debug.log('Game completed', 'success', {
			key: achievementKey,
			score: this.calculateScore()
		});
	}

	copyAchievementKey() {
		const keyElement = document.getElementById('achievement-key');
		const keyText = keyElement.textContent;

		navigator.clipboard.writeText(keyText)
			.then(() => {
				const button = document.getElementById('copy-key');
				const originalText = button.textContent;
				button.textContent = 'Copied!';

				setTimeout(() => {
					button.textContent = originalText;
				}, 2000);

				window.debug.log('Achievement key copied', 'info');
			})
			.catch(err => {
				window.debug.log('Failed to copy key', 'error', err);
				GameUtils.showNotification('Could not copy key. Please copy manually.', 'error');
			});
	}

	returnToPlatform() {
		const achievementKey = document.getElementById('achievement-key').textContent;

		if (this.gameState.platformReturnUrl) {
			const returnUrl = new URL(this.gameState.platformReturnUrl);
			returnUrl.searchParams.append('source', GAME_CONFIG.id);
			returnUrl.searchParams.append('completed', 'true');
			returnUrl.searchParams.append('key', achievementKey);

			window.debug.log('Returning to platform', 'info', {
				url: returnUrl.toString()
			});

			window.debug.trackNavigation(`Game: ${GAME_CONFIG.title}`, 'Game Platform', {
				completed: true,
				key: achievementKey
			});

			window.location.href = returnUrl.toString();
		} else {
			window.debug.log('No platform return URL', 'error');
			GameUtils.showNotification('Error: No return URL specified', 'error');
		}
	}

	calculateScore() {
		// Calculate base score from correct answers
		const quizScore = (this.gameState.correctAnswers / Object.keys(GAME_CONFIG.quizzes).length) * 60;

		// Add challenge completion (40%)
		const challengeScore = this.gameState.completedSections.includes('challenge') ? 40 : 0;

		return Math.round(quizScore + challengeScore);
	}
}

// Initialize game engine when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	window.gameEngine = new GameEngine();
});