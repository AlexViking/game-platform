/**
 * Platform Debug System
 */

class PlatformDebugger {
	constructor() {
		this.panel = null;
		this.isVisible = false;
		this.enabled = true;
		this.logs = [];
		this.navigationHistory = [];
		this.flowStates = {
			platform: { status: 'active', data: null },
			game: { status: 'pending', data: null },
			achievement: { status: 'pending', data: null },
			returnCV: { status: 'pending', data: null }
		};
	}

	init() {
		if (this.enabled) {
			this.createDebugPanel();
			this.setupEventListeners();
			this.setupKeyboardShortcuts();
			this.log('Platform debug mode initialized', 'success');
		}
	}

	enable() {
		this.enabled = true;
		this.init();
	}

	disable() {
		this.enabled = false;
		if (this.panel) {
			this.panel.remove();
			this.panel = null;
		}
	}

	toggle() {
		if (!this.enabled) {
			this.enable();
		} else {
			this.isVisible = !this.isVisible;
			if (this.panel) {
				this.panel.classList.toggle('hidden', !this.isVisible);
			}
		}
	}

	createDebugPanel() {
		this.panel = document.createElement('div');
		this.panel.id = 'debug-panel';
		this.panel.className = 'debug-panel hidden';
		this.panel.innerHTML = `
            <div class="debug-header">
                <h3 class="pixel-text">PLATFORM DEBUG CONSOLE</h3>
                <button id="debug-close" class="pixel-btn-small">×</button>
            </div>
            <div class="debug-tabs">
                <button class="debug-tab active" data-tab="flow">Flow</button>
                <button class="debug-tab" data-tab="games">Games</button>
                <button class="debug-tab" data-tab="storage">Storage</button>
                <button class="debug-tab" data-tab="navigation">Navigation</button>
                <button class="debug-tab" data-tab="logs">Logs</button>
            </div>
            <div class="debug-content">
                <div id="debug-flow" class="debug-tab-content active">
                    <div class="flow-visualization"></div>
                </div>
                <div id="debug-games" class="debug-tab-content">
                    <div id="games-status"></div>
                </div>
                <div id="debug-storage" class="debug-tab-content">
                    <pre id="storage-view"></pre>
                </div>
                <div id="debug-navigation" class="debug-tab-content">
                    <div id="nav-history"></div>
                </div>
                <div id="debug-logs" class="debug-tab-content">
                    <div id="log-entries"></div>
                </div>
            </div>
        `;

		document.body.appendChild(this.panel);
	}

	setupEventListeners() {
		// Close button
		document.getElementById('debug-close').addEventListener('click', () => {
			this.toggle();
		});

		// Tab switching
		this.panel.querySelectorAll('.debug-tab').forEach(tab => {
			tab.addEventListener('click', (e) => {
				this.switchTab(e.target.dataset.tab);
			});
		});
	}

	setupKeyboardShortcuts() {
		document.addEventListener('keydown', (e) => {
			// Ctrl + D to toggle debug panel
			if (e.ctrlKey && e.key === 'd') {
				e.preventDefault();
				this.toggle();
			}
		});
	}

	switchTab(tabName) {
		// Update active tab
		this.panel.querySelectorAll('.debug-tab').forEach(tab => {
			tab.classList.toggle('active', tab.dataset.tab === tabName);
		});

		// Show corresponding content
		this.panel.querySelectorAll('.debug-tab-content').forEach(content => {
			content.classList.toggle('active', content.id === `debug-${tabName}`);
		});

		// Refresh tab content
		this.refreshTabContent(tabName);
	}

	refreshTabContent(tabName) {
		switch (tabName) {
			case 'flow':
				this.updateFlowVisualization();
				break;
			case 'games':
				this.updateGamesStatus();
				break;
			case 'storage':
				this.updateStorageView();
				break;
			case 'navigation':
				this.updateNavHistory();
				break;
			case 'logs':
				this.updateLogEntries();
				break;
		}
	}

	updateFlowVisualization() {
		const flowContainer = this.panel.querySelector('.flow-visualization');
		const studentId = localStorage.getItem('studentId');

		const flowSteps = [
			{
				id: 'platform',
				title: 'Game Platform',
				data: `Student: ${studentId || 'Unknown'}`,
				status: this.flowStates.platform.status
			},
			{
				id: 'game',
				title: 'Current Game',
				data: this.flowStates.game.data || 'No game selected',
				status: this.flowStates.game.status
			},
			{
				id: 'achievement',
				title: 'Achievement Key',
				data: this.flowStates.achievement.data || 'Pending completion',
				status: this.flowStates.achievement.status
			},
			{
				id: 'returnCV',
				title: 'Return to CV',
				data: this.flowStates.returnCV.data || 'Not returned yet',
				status: this.flowStates.returnCV.status
			}
		];

		flowContainer.innerHTML = flowSteps.map((step, index) => `
            <div class="flow-step ${step.status}">
                <span class="flow-number">${index + 1}</span>
                <div class="flow-content">
                    <div class="flow-title">${step.title}</div>
                    <div class="flow-data">${step.data}</div>
                </div>
                ${index < flowSteps.length - 1 ? '<div class="flow-arrow"></div>' : ''}
            </div>
        `).join('');
	}

	updateGamesStatus() {
		const gamesContainer = document.getElementById('games-status');
		const completedGames = JSON.parse(localStorage.getItem('completedGames') || '[]');

		let gamesHTML = '<div class="games-grid">';

		Object.entries(PLATFORM_CONFIG.GAMES).forEach(([gameId, game]) => {
			const isCompleted = completedGames.includes(gameId);
			const prerequisites = game.prerequisites || [];
			const canAccess = prerequisites.every(prereq => completedGames.includes(prereq));

			gamesHTML += `
                <div class="game-debug-item ${isCompleted ? 'completed' : ''} ${canAccess ? 'accessible' : 'locked'}">
                    <div class="game-debug-icon">${game.icon}</div>
                    <div class="game-debug-info">
                        <div class="game-debug-title">${game.title}</div>
                        <div class="game-debug-status">
                            Status: ${isCompleted ? 'Completed' : canAccess ? 'Available' : 'Locked'}
                        </div>
                        <div class="game-debug-prereq">
                            Prerequisites: ${prerequisites.join(', ') || 'None'}
                        </div>
                    </div>
                </div>
            `;
		});

		gamesHTML += '</div>';
		gamesContainer.innerHTML = gamesHTML;
	}

	updateStorageView() {
		const storageView = document.getElementById('storage-view');
		const storageData = {
			localStorage: {},
			sessionStorage: {}
		};

		// Collect localStorage data
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			try {
				storageData.localStorage[key] = JSON.parse(localStorage.getItem(key));
			} catch {
				storageData.localStorage[key] = localStorage.getItem(key);
			}
		}

		// Collect sessionStorage data
		for (let i = 0; i < sessionStorage.length; i++) {
			const key = sessionStorage.key(i);
			try {
				storageData.sessionStorage[key] = JSON.parse(sessionStorage.getItem(key));
			} catch {
				storageData.sessionStorage[key] = sessionStorage.getItem(key);
			}
		}

		storageView.textContent = JSON.stringify(storageData, null, 2);
	}

	updateNavHistory() {
		const navHistory = document.getElementById('nav-history');

		navHistory.innerHTML = this.navigationHistory.map((entry, index) => `
            <div class="nav-entry">
                <span class="nav-time">${entry.time}</span>
                <span class="nav-from">${entry.from}</span>
                <span class="nav-arrow">→</span>
                <span class="nav-to">${entry.to}</span>
                <div class="nav-data">${JSON.stringify(entry.data || {})}</div>
            </div>
        `).join('');
	}

	updateLogEntries() {
		const logContainer = document.getElementById('log-entries');
		logContainer.innerHTML = this.logs.map(log => `
            <div class="log-entry ${log.type}">
                <span class="log-time">[${log.time}]</span>
                <span class="log-message">${log.message}</span>
            </div>
        `).join('');
		logContainer.scrollTop = logContainer.scrollHeight;
	}

	// Public API methods
	log(message, type = 'info', data = null) {
		if (!this.enabled) return;

		const time = new Date().toLocaleTimeString();
		this.logs.push({ time, message, type, data });

		if (this.isVisible) {
			this.updateLogEntries();
		}

		// Also log to console with styling
		const consoleStyles = {
			info: 'color: #3b82f6',
			success: 'color: #10b981',
			warning: 'color: #f59e0b',
			error: 'color: #f43f5e'
		};

		console.log(`%c[Platform Debug] ${message}`, consoleStyles[type] || '');
		if (data) {
			console.log(data);
		}
	}

	trackNavigation(from, to, data = {}) {
		if (!this.enabled) return;

		this.navigationHistory.push({
			time: new Date().toLocaleTimeString(),
			from,
			to,
			data
		});

		// Update flow states
		if (from === 'Game Platform' && to.startsWith('Game:')) {
			this.flowStates.platform.status = 'completed';
			this.flowStates.game.status = 'active';
			this.flowStates.game.data = `Playing: ${to.replace('Game: ', '')}`;
		}

		if (from.startsWith('Game:') && to === 'Game Platform') {
			this.flowStates.game.status = 'completed';
			this.flowStates.achievement.status = 'active';
			this.flowStates.achievement.data = 'Key generated';
		}

		if (from === 'Game Platform' && to === 'Student CV' && data.key) {
			this.flowStates.achievement.status = 'completed';
			this.flowStates.returnCV.status = 'active';
			this.flowStates.returnCV.data = 'Returned with key';
		}

		if (this.isVisible) {
			this.updateNavHistory();
			this.updateFlowVisualization();
		}
	}

	updateFlowState(step, status, data = null) {
		if (!this.enabled) return;

		if (this.flowStates[step]) {
			this.flowStates[step].status = status;
			if (data) {
				this.flowStates[step].data = data;
			}

			if (this.isVisible) {
				this.updateFlowVisualization();
			}
		}
	}
}

// Initialize debug system
window.debug = new PlatformDebugger();

// Check if debug should be enabled by default
if (PLATFORM_CONFIG.DEBUG.ENABLED_BY_DEFAULT || window.location.search.includes('debug=true')) {
	window.debug.enable();
}