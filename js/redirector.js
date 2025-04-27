/**
 * Game Platform Redirector - Enhanced for circular flow
 * Handles game redirection, progress tracking, and returns to CV
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
	// Get URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const studentId = urlParams.get('student') || localStorage.getItem('studentId');
	const completedGames = JSON.parse(urlParams.get('completed') || '[]');
	const returnUrl = urlParams.get('return_url');

	// Store return URL and student ID
	if (returnUrl) {
		localStorage.setItem('cvReturnUrl', returnUrl);
	}
	if (studentId) {
		localStorage.setItem('studentId', studentId);
		showStudentProgress(studentId);
	}

	// Update available games based on completed games
	updateAvailableGamesFromCV(completedGames);

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

	// If coming back from a completed game
	const source = urlParams.get('source');
	const completed = urlParams.get('completed');
	const newKey = urlParams.get('key');

	if (source && completed === 'true' && newKey) {
		handleGameCompletion(source);

		// Show return to CV button
		showReturnToCV(newKey);
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
 * Update game availability based on progress from CV
 */
function updateAvailableGamesFromCV(completedGames) {
	// Create progress object from completed games
	const progress = {};
	completedGames.forEach(gameId => {
		progress[gameId] = 'completed';
	});

	// Update available games
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

		// Get the game element
		let gameElement = findGameElement(gameId);

		// If game element found, update its state
		if (gameElement) {
			if (canAccess || progress[gameId] === 'completed') {
				gameElement.classList.remove('locked');
				gameElement.classList.add('available');

				// Replace lock text with link
				const lockSpan = gameElement.querySelector('.game-lock');
				const linkElement = gameElement.querySelector('.game-link');

				if (lockSpan && !linkElement) {
					const newLink = document.createElement('button');
					newLink.className = 'game-link';
					newLink.textContent = 'Start Game';
					newLink.onclick = () => startGame(gameId, progress[gameId] === 'completed');

					lockSpan.parentNode.replaceChild(newLink, lockSpan);
				} else if (linkElement) {
					// Update existing link
					linkElement.onclick = () => startGame(gameId, progress[gameId] === 'completed');
				}
			}
		}
	}

	// Update path status based on progress
	updatePathStatus(progress);
}

/**
 * Find game element by game ID
 */
function findGameElement(gameId) {
	const title = getGameTitle(gameId);
	const gameTitles = document.querySelectorAll('.game-title');

	for (const titleElement of gameTitles) {
		if (titleElement.textContent === title) {
			return titleElement.closest('.game-item');
		}
	}

	return null;
}

/**
 * Start a game with previous attempts data
 */
function startGame(gameId, isRetake = false) {
	const studentId = localStorage.getItem('studentId');
	const previousAttempts = JSON.parse(localStorage.getItem(`attempts_${studentId}_${gameId}`) || '[]');
	const cvReturnUrl = localStorage.getItem('cvReturnUrl');

	// Build game URL
	const gameUrl = new URL(`https://AlexViking.github.io/game-${gameId}`);
	gameUrl.searchParams.append('student', studentId);
	gameUrl.searchParams.append('isRetake', isRetake);
	gameUrl.searchParams.append('attempts', JSON.stringify(previousAttempts));
	gameUrl.searchParams.append('platform_return', window.location.href);

	// Pass CV return URL to the game
	if (cvReturnUrl) {
		gameUrl.searchParams.append('cv_return', cvReturnUrl);
	}

	// Navigate in same tab
	window.location.href = gameUrl.toString();
}

/**
 * Show return to CV button
 */
function showReturnToCV(key) {
	const returnUrl = localStorage.getItem('cvReturnUrl');
	if (!returnUrl) return;

	// Create return button section
	const returnSection = document.createElement('section');
	returnSection.innerHTML = `
		<h2>Achievement Unlocked! 🎉</h2>
		<p>You've earned a new achievement key. Click below to return to your CV and add it.</p>
		<div class="key-container">
			<code id="key-display">${key}</code>
			<button onclick="copyKey('${key}')" class="btn btn-small">Copy</button>
		</div>
		<button id="return-to-cv" class="pixel-btn">Return to Your CV Template</button>
	`;

	document.querySelector('main').insertBefore(returnSection, document.querySelector('main').firstChild);

	// Add click handler
	document.getElementById('return-to-cv').addEventListener('click', () => {
		const url = new URL(returnUrl);
		url.searchParams.append('key', key);
		window.location.href = url.toString();
	});
}

/**
 * Copy key to clipboard
 */
function copyKey(key) {
	navigator.clipboard.writeText(key).then(() => {
		const button = event.target;
		const originalText = button.textContent;
		button.textContent = 'Copied!';
		setTimeout(() => {
			button.textContent = originalText;
		}, 2000);
	});
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