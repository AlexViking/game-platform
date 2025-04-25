/**
 * Game Platform Redirector
 * Handles game redirection and progress tracking
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	// Check for student ID in localStorage
	const studentId = localStorage.getItem('studentId');
	if (studentId) {
		showStudentProgress(studentId);
	}

	// Handle student ID form submission
	document.getElementById('student-id-form').addEventListener('submit', function (e) {
		e.preventDefault();
		const studentIdInput = document.getElementById('student-id');
		const studentId = studentIdInput.value.trim();

		if (studentId) {
			localStorage.setItem('studentId', studentId);
			showStudentProgress(studentId);
		}
	});

	// Handle URL parameters for tracking
	const urlParams = new URLSearchParams(window.location.search);
	const source = urlParams.get('source');
	const completed = urlParams.get('completed');

	// If coming back from a completed game
	if (source && completed === 'true') {
		handleGameCompletion(source);
	}
});

/**
 * Show student progress based on stored data
 * @param {string} studentId - The student's identifier
 */
function showStudentProgress(studentId) {
	// Get progress from localStorage or initialize empty object
	const progress = JSON.parse(localStorage.getItem(`progress_${studentId}`) || '{}');

	// Update progress container
	const progressContainer = document.querySelector('.progress-container');

	// Build progress display
	let progressHTML = `
        <div class="progress-header">
            <h3>Progress for ${studentId}</h3>
            <button id="sign-out" class="btn btn-small">Sign Out</button>
        </div>
        <div class="progress-stats">
    `;

	// Count completed games
	const completedGames = Object.values(progress).filter(status => status === 'completed').length;

	// Add stats
	progressHTML += `
            <div class="stat-item">
                <span class="stat-label">Completed Games:</span>
                <span class="stat-value">${completedGames}</span>
            </div>
    `;

	// Add specific game progress if any games are completed
	if (completedGames > 0) {
		progressHTML += `
            <div class="game-progress">
                <h4>Game Progress:</h4>
                <ul class="progress-list">
        `;

		// Add each completed game
		for (const gameId in progress) {
			if (progress[gameId] === 'completed') {
				progressHTML += `<li>${getGameTitle(gameId)} - Completed</li>`;
			}
		}

		progressHTML += `
                </ul>
            </div>
        `;
	}

	progressHTML += `</div>`;

	// Set the HTML content
	progressContainer.innerHTML = progressHTML;

	// Add event listener for sign out button
	document.getElementById('sign-out').addEventListener('click', function () {
		localStorage.removeItem('studentId');
		location.reload();
	});

	// Update available games based on progress
	updateAvailableGames(progress);
}

/**
 * Update game availability based on progress
 * @param {Object} progress - The student's progress data
 */
function updateAvailableGames(progress) {
	// Define game dependencies (which games need to be completed before unlocking)
	const gameDependencies = {
		'internet-basics': [], // No prerequisites
		'html-fundamentals': ['internet-basics'], // Requires internet basics
		'css-styling': ['internet-basics', 'html-fundamentals'], // Requires both previous games
		'javascript-basics': ['internet-basics', 'html-fundamentals', 'css-styling'] // Requires all beginner path
	};

	// Check each game
	for (const gameId in gameDependencies) {
		const dependencies = gameDependencies[gameId];

		// Check if all dependencies are completed
		const canAccess = dependencies.every(dep => progress[dep] === 'completed');

		// Get the game element - FIX: Use standard DOM methods instead of :contains selector
		let gameElement = null;

		// Find game item by data attribute if it exists
		const gameElementByData = document.querySelector(`.game-item[data-game="${gameId}"]`);
		if (gameElementByData) {
			gameElement = gameElementByData;
		} else {
			// Otherwise find by matching title text
			const title = getGameTitle(gameId);
			const gameTitles = document.querySelectorAll('.game-title');
			for (let i = 0; i < gameTitles.length; i++) {
				if (gameTitles[i].textContent.includes(title)) {
					gameElement = gameTitles[i].closest('.game-item');
					break;
				}
			}
		}

		// If game element found, update its state
		if (gameElement) {
			if (canAccess) {
				gameElement.classList.remove('locked');
				gameElement.classList.add('available');

				// Replace lock text with link
				const lockSpan = gameElement.querySelector('.game-lock');
				if (lockSpan) {
					const linkElement = document.createElement('a');
					linkElement.href = `https://example.github.io/game-${gameId}?student=${localStorage.getItem('studentId')}`;
					linkElement.className = 'game-link';
					linkElement.textContent = 'Start Game';

					lockSpan.parentNode.replaceChild(linkElement, lockSpan);
				}
			}
		}
	}

	// Update path status based on progress
	updatePathStatus(progress);
}

/**
 * Update learning path status based on progress
 * @param {Object} progress - The student's progress data
 */
function updatePathStatus(progress) {
	// Define path requirements
	const pathRequirements = {
		'intermediate': ['internet-basics', 'html-fundamentals', 'css-styling'],
		'advanced': ['javascript-basics', 'dom-manipulation', 'web-apis']
	};

	// Check intermediate path
	const intermediatePath = document.querySelector('.path-card.intermediate');
	const intermediateComplete = pathRequirements.intermediate.every(game => progress[game] === 'completed');

	if (intermediateComplete) {
		intermediatePath.classList.add('active');
		intermediatePath.classList.remove('locked');

		const statusSpan = intermediatePath.querySelector('.path-status');
		if (statusSpan) {
			statusSpan.textContent = 'Available';
		}
	}

	// Check advanced path (would need intermediate path completed)
	const advancedPath = document.querySelector('.path-card.advanced');
	const advancedComplete = pathRequirements.advanced.every(game => progress[game] === 'completed');

	if (advancedComplete) {
		advancedPath.classList.add('active');
		advancedPath.classList.remove('locked');

		const statusSpan = advancedPath.querySelector('.path-status');
		if (statusSpan) {
			statusSpan.textContent = 'Available';
		}
	}
}

/**
 * Handle completion of a game
 * @param {string} gameId - The ID of the completed game
 */
function handleGameCompletion(gameId) {
	const studentId = localStorage.getItem('studentId');
	if (!studentId) return;

	// Get current progress
	const progress = JSON.parse(localStorage.getItem(`progress_${studentId}`) || '{}');

	// Mark game as completed
	progress[gameId] = 'completed';

	// Save updated progress
	localStorage.setItem(`progress_${studentId}`, JSON.stringify(progress));

	// Show success message
	showCompletionMessage(gameId);

	// Update available games
	showStudentProgress(studentId);
}

/**
 * Show a message when a game is completed
 * @param {string} gameId - The ID of the completed game
 */
function showCompletionMessage(gameId) {
	// Create message element
	const messageDiv = document.createElement('div');
	messageDiv.className = 'completion-message';
	messageDiv.innerHTML = `
        <div class="message-content">
            <h3>🎉 Congratulations!</h3>
            <p>You've completed ${getGameTitle(gameId)}!</p>
            <p>Don't forget to use your achievement key to update your CV.</p>
        </div>
    `;

	// Add to body
	document.body.appendChild(messageDiv);

	// Remove after 5 seconds
	setTimeout(() => {
		messageDiv.classList.add('fade-out');
		setTimeout(() => {
			document.body.removeChild(messageDiv);
		}, 500);
	}, 5000);
}

/**
 * Get a human-readable game title from game ID
 * @param {string} gameId - The game identifier
 * @returns {string} The game title
 */
function getGameTitle(gameId) {
	const gameTitles = {
		'internet-basics': 'The Internet Basics',
		'html-fundamentals': 'HTML Fundamentals',
		'css-styling': 'CSS Styling',
		'javascript-basics': 'JavaScript Basics',
		'dom-manipulation': 'DOM Manipulation',
		'web-apis': 'Web APIs'
	};

	return gameTitles[gameId] || gameId;
}