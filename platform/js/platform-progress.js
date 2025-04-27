/**
 * Platform Progress Tracking
 * Manages student progress across all games
 */

class PlatformProgress {
	constructor() {
		this.studentId = null;
		this.progress = {};
		this.loadProgress();
	}

	loadProgress() {
		// Get student ID from localStorage
		this.studentId = localStorage.getItem('studentId');

		if (this.studentId) {
			// Load progress for this student
			const savedProgress = localStorage.getItem(`progress_${this.studentId}`);
			if (savedProgress) {
				this.progress = JSON.parse(savedProgress);
			} else {
				this.progress = this.initializeProgress();
			}
		}
	}

	initializeProgress() {
		const initialProgress = {};

		// Initialize progress for all games
		Object.keys(PLATFORM_CONFIG.GAMES).forEach(gameId => {
			initialProgress[gameId] = {
				status: 'not_started',
				score: 0,
				attempts: 0,
				bestScore: 0,
				lastAttempt: null,
				completionTime: null,
				achievements: []
			};
		});

		return initialProgress;
	}

	saveProgress() {
		if (this.studentId) {
			localStorage.setItem(`progress_${this.studentId}`, JSON.stringify(this.progress));
			window.debug.log('Progress saved', 'info', this.progress);
		}
	}

	updateGameProgress(gameId, data) {
		if (!this.progress[gameId]) {
			this.progress[gameId] = {
				status: 'not_started',
				score: 0,
				attempts: 0,
				bestScore: 0,
				lastAttempt: null,
				completionTime: null,
				achievements: []
			};
		}

		// Update progress data
		if (data.status) this.progress[gameId].status = data.status;
		if (data.score) {
			this.progress[gameId].score = data.score;
			if (data.score > this.progress[gameId].bestScore) {
				this.progress[gameId].bestScore = data.score;
			}
		}
		if (data.attempts) this.progress[gameId].attempts = data.attempts;
		if (data.completionTime) this.progress[gameId].completionTime = data.completionTime;
		if (data.achievements) this.progress[gameId].achievements = data.achievements;

		this.progress[gameId].lastAttempt = new Date().toISOString();

		this.saveProgress();
		this.updateUI();
	}

	markGameCompleted(gameId) {
		this.updateGameProgress(gameId, {
			status: 'completed',
			completionTime: Date.now()
		});
	}

	getGameProgress(gameId) {
		return this.progress[gameId] || null;
	}

	getTotalProgress() {
		const total = Object.keys(PLATFORM_CONFIG.GAMES).length;
		const completed = Object.values(this.progress).filter(game => game.status === 'completed').length;
		const inProgress = Object.values(this.progress).filter(game => game.status === 'in_progress').length;

		return {
			total,
			completed,
			inProgress,
			percentage: Math.round((completed / total) * 100)
		};
	}

	updateUI() {
		// Update progress display
		const totalProgress = this.getTotalProgress();
		const progressContent = document.getElementById('progress-content');

		if (progressContent) {
			progressContent.innerHTML = `
                <div class="progress-header">
                    <h3>Progress for ${this.studentId}</h3>
                </div>
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-label">Completed Games:</span>
                        <span class="stat-value">${totalProgress.completed}/${totalProgress.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">In Progress:</span>
                        <span class="stat-value">${totalProgress.inProgress}</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${totalProgress.percentage}%"></div>
                </div>
                <span class="progress-text">${totalProgress.percentage}% Complete</span>
                ${this.generateGameProgressDetails()}
            `;
		}
	}

	generateGameProgressDetails() {
		let html = '<div class="game-progress-details">';

		Object.entries(this.progress).forEach(([gameId, gameProgress]) => {
			const game = PLATFORM_CONFIG.GAMES[gameId];
			if (!game) return;

			html += `
                <div class="game-progress-item ${gameProgress.status}">
                    <div class="game-progress-icon">${game.icon}</div>
                    <div class="game-progress-info">
                        <div class="game-progress-title">${game.title}</div>
                        <div class="game-progress-status">
                            Status: ${this.formatStatus(gameProgress.status)}
                            ${gameProgress.bestScore > 0 ? `| Best Score: ${gameProgress.bestScore}` : ''}
                        </div>
                        ${gameProgress.lastAttempt ? `
                            <div class="game-progress-attempt">
                                Last Attempt: ${new Date(gameProgress.lastAttempt).toLocaleDateString()}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
		});

		html += '</div>';
		return html;
	}

	formatStatus(status) {
		const statusMap = {
			'not_started': 'Not Started',
			'in_progress': 'In Progress',
			'completed': 'Completed'
		};
		return statusMap[status] || status;
	}

	checkPrerequisites(gameId) {
		const game = PLATFORM_CONFIG.GAMES[gameId];
		if (!game || !game.prerequisites || game.prerequisites.length === 0) {
			return true;
		}

		return game.prerequisites.every(prereqId => {
			const prereqProgress = this.progress[prereqId];
			return prereqProgress && prereqProgress.status === 'completed';
		});
	}

	exportProgress() {
		return {
			studentId: this.studentId,
			progress: this.progress,
			exportDate: new Date().toISOString()
		};
	}

	importProgress(data) {
		if (data && data.studentId === this.studentId) {
			this.progress = data.progress;
			this.saveProgress();
			this.updateUI();
			return true;
		}
		return false;
	}
}

// Initialize progress system
window.platformProgress = new PlatformProgress();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = PlatformProgress;
}