/**
 * Platform router - handles navigation and game loading
 */

class PlatformRouter {
	constructor() {
		this.studentData = {};
		this.initialize();
	}

	// initialize() {
	// 	// Load student data from URL or localStorage
	// 	this.loadStudentData();

	// 	// Set up event listeners
	// 	this.setupEventListeners();

	// 	// Check if returning from a game
	// 	this.checkForGameReturn();

	// 	// Initialize progress display
	// 	this.updateProgressDisplay();

	// 	window.debug.log('Platform router initialized', 'info');
	// }

	initialize() {
		// Load student data from URL or localStorage
		this.loadStudentData();

		// Set up event listeners
		this.setupEventListeners();

		// Check if returning from a game
		this.checkForGameReturn();

		// Update available games based on completed games
		this.updateAvailableGames();

		// Initialize progress display
		this.updateProgressDisplay();

		window.debug.log('Platform router initialized', 'info');
	}

	// loadStudentData() {
	// 	const urlParams = new URLSearchParams(window.location.search);

	// 	this.studentData = {
	// 		studentId: urlParams.get('student') || localStorage.getItem('studentId'),
	// 		completedGames: JSON.parse(urlParams.get('completed') || '[]'),
	// 		returnUrl: urlParams.get('return_url') || localStorage.getItem('cvReturnUrl')
	// 	};

	// 	// Store data for later use
	// 	if (this.studentData.studentId) {
	// 		localStorage.setItem('studentId', this.studentData.studentId);
	// 	}
	// 	if (this.studentData.returnUrl) {
	// 		localStorage.setItem('cvReturnUrl', this.studentData.returnUrl);
	// 	}

	// 	window.debug.log('Student data loaded', 'info', this.studentData);
	// }

	loadStudentData() {
		const urlParams = new URLSearchParams(window.location.search);

		this.studentData = {
			studentId: urlParams.get('student') || localStorage.getItem('studentId'),
			completedGames: JSON.parse(urlParams.get('completed') || '[]'),
			returnUrl: urlParams.get('return_url') || localStorage.getItem('cvReturnUrl')
		};

		// Also get completed games from localStorage and merge
		const storedCompletedGames = JSON.parse(localStorage.getItem('completedGames') || '[]');
		this.studentData.completedGames = [...new Set([...this.studentData.completedGames, ...storedCompletedGames])];

		// Store data for later use
		if (this.studentData.studentId) {
			localStorage.setItem('studentId', this.studentData.studentId);
		}
		if (this.studentData.returnUrl) {
			localStorage.setItem('cvReturnUrl', this.studentData.returnUrl);
		}
		if (this.studentData.completedGames.length > 0) {
			localStorage.setItem('completedGames', JSON.stringify(this.studentData.completedGames));
		}

		window.debug.log('Student data loaded', 'info', this.studentData);
	}

	setupEventListeners() {
		// Debug mode toggle
		document.getElementById('debug-mode-toggle').addEventListener('click', () => {
			window.debug.toggle();
		});
	}

	checkForGameReturn() {
		const urlParams = new URLSearchParams(window.location.search);
		const source = urlParams.get('source');
		const completed = urlParams.get('completed') === 'true';
		const newKey = urlParams.get('key');

		if (source && completed && newKey) {
			this.handleGameCompletion(source, newKey);
		}
	}

	// handleGameCompletion(gameId, key) {
	// 	window.debug.log(`Game completed: ${gameId}`, 'success');

	// 	// Update completed games
	// 	if (!this.studentData.completedGames.includes(gameId)) {
	// 		this.studentData.completedGames.push(gameId);
	// 		localStorage.setItem('completedGames', JSON.stringify(this.studentData.completedGames));
	// 	}

	// 	// Show return to CV option
	// 	this.showReturnToCV(key);

	// 	// Update available games
	// 	this.updateAvailableGames();
	// }

	handleGameCompletion(gameId, key) {
		window.debug.log(`Game completed: ${gameId}`, 'success');

		// Update completed games
		if (!this.studentData.completedGames.includes(gameId)) {
			this.studentData.completedGames.push(gameId);
			localStorage.setItem('completedGames', JSON.stringify(this.studentData.completedGames));
		}

		// Show return to CV option
		this.showReturnToCV(key);

		// Update available games
		this.updateAvailableGames();

		// Update progress display
		this.updateProgressDisplay();
	}

	showReturnToCV(key) {
		const returnUrl = this.studentData.returnUrl;
		if (!returnUrl) return;

		const returnSection = document.createElement('section');
		returnSection.className = 'return-section';
		returnSection.innerHTML = `
            <h2>Achievement Unlocked! 🎉</h2>
            <p>You've earned a new achievement key. Choose what to do next:</p>
            <div class="button-group">
                <button class="pixel-btn" onclick="platformRouter.returnToCV('${key}')">Return to Your CV</button>
                <button class="pixel-btn" onclick="platformRouter.continueHere()">Continue Learning</button>
            </div>
        `;

		document.querySelector('main').insertBefore(returnSection, document.querySelector('#welcome'));
	}

	returnToCV(key) {
		if (!this.studentData.returnUrl) return;

		const url = new URL(this.studentData.returnUrl);
		url.searchParams.append('key', key);

		window.debug.log('Returning to CV with key', 'info');
		window.debug.trackNavigation('Game Platform', 'Student CV', { key });

		window.location.href = url.toString();
	}

	continueHere() {
		// Hide return section
		const returnSection = document.querySelector('.return-section');
		if (returnSection) {
			returnSection.remove();
		}

		// Clean up URL
		window.history.replaceState({}, document.title, window.location.pathname);
	}

	startGame(gameId) {
		const game = PLATFORM_CONFIG.GAMES[gameId];
		if (!game) {
			window.debug.log(`Game not found: ${gameId}`, 'error');
			return;
		}

		// Check prerequisites
		if (!this.checkPrerequisites(gameId)) {
			PlatformUtils.showNotification('Please complete prerequisite games first', 'warning');
			return;
		}

		// Build game URL
		const gameUrl = new URL(game.path, window.location.href);
		gameUrl.searchParams.append('student', this.studentData.studentId);
		gameUrl.searchParams.append('platform_return', window.location.href);

		// Add CV return URL if available
		if (this.studentData.returnUrl) {
			gameUrl.searchParams.append('cv_return', this.studentData.returnUrl);
		}

		// Add previous attempts if any
		const attempts = JSON.parse(localStorage.getItem(`attempts_${gameId}`) || '[]');
		gameUrl.searchParams.append('attempts', JSON.stringify(attempts));

		window.debug.log(`Starting game: ${gameId}`, 'info');
		window.debug.trackNavigation('Game Platform', `Game: ${game.title}`, { gameId });

		// Navigate to game
		window.location.href = gameUrl.toString();
	}

	checkPrerequisites(gameId) {
		const game = PLATFORM_CONFIG.GAMES[gameId];
		if (!game || !game.prerequisites) return true;

		return game.prerequisites.every(prereq =>
			this.studentData.completedGames.includes(prereq)
		);
	}

	// updateAvailableGames() {
	// 	// Update each game item based on completion status
	// 	Object.entries(PLATFORM_CONFIG.GAMES).forEach(([gameId, game]) => {
	// 		const gameElement = this.findGameElement(game.title);
	// 		if (!gameElement) return;

	// 		const canAccess = this.checkPrerequisites(gameId);
	// 		const isCompleted = this.studentData.completedGames.includes(gameId);

	// 		if (canAccess || isCompleted) {
	// 			gameElement.classList.remove('locked');
	// 			gameElement.classList.add('available');

	// 			// Replace lock with button
	// 			const lockSpan = gameElement.querySelector('.game-lock');
	// 			if (lockSpan) {
	// 				const button = document.createElement('button');
	// 				button.className = 'game-link';
	// 				button.textContent = isCompleted ? 'Play Again' : 'Start Game';
	// 				button.onclick = () => this.startGame(gameId);
	// 				lockSpan.parentNode.replaceChild(button, lockSpan);
	// 			}
	// 		}
	// 	});

	// 	// Update path status
	// 	this.updatePathStatus();
	// }

	updateAvailableGames() {
		// Update each game item based on completion status
		Object.entries(PLATFORM_CONFIG.GAMES).forEach(([gameId, game]) => {
			const gameElement = this.findGameElement(game.title);
			if (!gameElement) {
				window.debug.log(`Game element not found for ${game.title}`, 'warning');
				return;
			}

			const canAccess = this.checkPrerequisites(gameId);
			const isCompleted = this.studentData.completedGames.includes(gameId);

			if (canAccess || isCompleted) {
				gameElement.classList.remove('locked');
				gameElement.classList.add('available');

				// Replace lock with button
				const lockSpan = gameElement.querySelector('.game-lock');
				if (lockSpan) {
					const button = document.createElement('button');
					button.className = 'game-link';
					button.textContent = isCompleted ? 'Play Again' : 'Start Game';
					button.onclick = () => this.startGame(gameId);
					lockSpan.parentNode.replaceChild(button, lockSpan);
				}
			} else {
				gameElement.classList.add('locked');
				gameElement.classList.remove('available');
			}
		});

		// Update path status
		this.updatePathStatus();
	}

	updatePathStatus() {
		Object.entries(PLATFORM_CONFIG.PATHS).forEach(([pathId, path]) => {
			const pathCard = document.querySelector(`.path-card.${pathId}`);
			if (!pathCard) return;

			// Check if prerequisite path is completed
			if (path.prerequisite) {
				const prereqPath = PLATFORM_CONFIG.PATHS[path.prerequisite];
				const prereqCompleted = prereqPath.games.every(gameId =>
					this.studentData.completedGames.includes(gameId)
				);

				if (prereqCompleted) {
					pathCard.classList.remove('locked');
					pathCard.classList.add('active');
					pathCard.querySelector('.path-status').textContent = 'Available';
				}
			}
		});
	}

	findGameElement(title) {
		const gameTitles = document.querySelectorAll('.game-title');
		for (const titleElement of gameTitles) {
			if (titleElement.textContent === title) {
				return titleElement.closest('.game-item');
			}
		}
		return null;
	}

	updateProgressDisplay() {
		const progressContainer = document.getElementById('progress-content');
		if (!progressContainer) return;

		if (!this.studentData.studentId) {
			progressContainer.innerHTML = `
                <div class="progress-empty">
                    <p>Welcome! Your progress will be tracked automatically.</p>
                </div>
            `;
		} else {
			const progress = this.calculateProgress();
			progressContainer.innerHTML = `
                <div class="progress-header">
                    <h3>Progress for ${this.studentData.studentId}</h3>
                </div>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-label">Completed Games:</span>
                        <span class="stat-value">${progress.completed}/${progress.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Current Path:</span>
                        <span class="stat-value">${progress.currentPath}</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                </div>
                <span class="progress-text">${progress.percentage}% Complete</span>
            `;
		}
	}

	calculateProgress() {
		const totalGames = Object.keys(PLATFORM_CONFIG.GAMES).length;
		const completedGames = this.studentData.completedGames.length;
		const percentage = Math.round((completedGames / totalGames) * 100);

		// Determine current path
		let currentPath = 'Beginner Path';
		Object.entries(PLATFORM_CONFIG.PATHS).forEach(([pathId, path]) => {
			const pathCompleted = path.games.every(gameId =>
				this.studentData.completedGames.includes(gameId)
			);

			if (!pathCompleted && path.games.some(gameId =>
				this.studentData.completedGames.includes(gameId)
			)) {
				currentPath = path.title;
			}
		});

		return {
			completed: completedGames,
			total: totalGames,
			percentage,
			currentPath
		};
	}
}

// Initialize platform router
const platformRouter = new PlatformRouter();