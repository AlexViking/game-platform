/**
 * Enhanced Debug Visualizer for Learning Games Platform
 * Provides pixel-themed visual debugging across all components
 */

class DebugVisualizer {
	constructor() {
		this.panel = null;
		this.isVisible = false;
		this.enabled = false;
		this.logs = [];
		this.navigationHistory = [];
		this.flowStates = {
			cv: { status: 'pending', data: null },
			platform: { status: 'pending', data: null },
			game: { status: 'pending', data: null },
			achievement: { status: 'pending', data: null }
		};
		this.keyboardShortcuts = true;
	}

	async init() {
		if (this.enabled) {
			await this.createDebugPanel();
			this.setupEventListeners();
			this.setupKeyboardShortcuts();
			this.setupDataTracking();
			this.log('Debug visualizer initialized', 'success');
		}
	}

	async createDebugPanel() {
		// Load debug panel template
		try {
			const response = await fetch('../debug/debug-panel.html');
			const panelHTML = await response.text();

			// Create a container and insert the panel
			const container = document.createElement('div');
			container.innerHTML = panelHTML;
			this.panel = container.firstElementChild;

			document.body.appendChild(this.panel);
			this.injectStyles();
		} catch (error) {
			// Fallback: create panel programmatically
			this.createPanelProgrammatically();
		}
	}

	createPanelProgrammatically() {
		this.panel = document.createElement('div');
		this.panel.id = 'debug-panel';
		this.panel.className = 'debug-panel hidden';
		this.panel.innerHTML = `
            <div class="debug-header">
                <h3 class="pixel-text">DEBUG CONSOLE</h3>
                <button id="debug-close" class="pixel-btn-small">×</button>
            </div>
            <div class="debug-tabs">
                <button class="debug-tab active" data-tab="flow">Flow</button>
                <button class="debug-tab" data-tab="storage">Storage</button>
                <button class="debug-tab" data-tab="navigation">Navigation</button>
                <button class="debug-tab" data-tab="keys">Keys</button>
                <button class="debug-tab" data-tab="logs">Logs</button>
            </div>
            <div class="debug-content">
                <div id="debug-flow" class="debug-tab-content active">
                    <div class="flow-visualization"></div>
                </div>
                <div id="debug-storage" class="debug-tab-content">
                    <pre id="storage-view"></pre>
                </div>
                <div id="debug-navigation" class="debug-tab-content">
                    <div id="nav-history"></div>
                </div>
                <div id="debug-keys" class="debug-tab-content">
                    <div id="key-list"></div>
                </div>
                <div id="debug-logs" class="debug-tab-content">
                    <div id="log-entries"></div>
                </div>
            </div>
        `;

		document.body.appendChild(this.panel);
		this.injectStyles();
	}

	injectStyles() {
		// Add pixel-themed animations
		const style = document.createElement('style');
		style.textContent = `
            @keyframes pixelGlitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
            }
            
            @keyframes flowPulse {
                0% { box-shadow: 0 0 5px var(--primary-color); }
                50% { box-shadow: 0 0 20px var(--primary-color); }
                100% { box-shadow: 0 0 5px var(--primary-color); }
            }
            
            .debug-panel.glitch {
                animation: pixelGlitch 0.5s;
            }
            
            .flow-step.active {
                animation: flowPulse 2s infinite;
            }
            
            /* Pixel-themed tooltips */
            .debug-tooltip {
                position: absolute;
                background: var(--dark-color);
                border: 2px solid var(--primary-color);
                padding: 8px;
                font-size: 10px;
                z-index: 10000;
                display: none;
                box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
            }
            
            .debug-tooltip.visible {
                display: block;
            }
        `;
		document.head.appendChild(style);
	}

	setupEventListeners() {
		// Close button
		this.panel.querySelector('#debug-close').addEventListener('click', () => {
			this.toggle();
		});

		// Tab switching
		this.panel.querySelectorAll('.debug-tab').forEach(tab => {
			tab.addEventListener('click', (e) => {
				this.switchTab(e.target.dataset.tab);
			});
		});

		// Prevent debug panel from being dragged
		this.panel.addEventListener('dragstart', (e) => e.preventDefault());
	}

	setupKeyboardShortcuts() {
		if (!this.keyboardShortcuts) return;

		document.addEventListener('keydown', (e) => {
			// Ctrl/Cmd + D to toggle debug panel
			if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
				e.preventDefault();
				this.toggle();
			}

			// Ctrl/Cmd + Shift + L to clear logs
			if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
				e.preventDefault();
				this.clearLogs();
			}
		});
	}

	setupDataTracking() {
		// Track storage changes
		const originalSetItem = localStorage.setItem;
		localStorage.setItem = (key, value) => {
			originalSetItem.call(localStorage, key, value);
			this.log(`Storage updated: ${key}`, 'info');
			if (this.isVisible) {
				this.updateStorageView();
			}
		};

		// Track navigation
		window.addEventListener('popstate', () => {
			this.log('Navigation: Browser back/forward', 'info');
		});
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

				// Add glitch effect on toggle
				this.panel.classList.add('glitch');
				setTimeout(() => {
					this.panel.classList.remove('glitch');
				}, 500);
			}
		}
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
			case 'storage':
				this.updateStorageView();
				break;
			case 'navigation':
				this.updateNavHistory();
				break;
			case 'keys':
				this.updateKeyList();
				break;
			case 'logs':
				this.updateLogEntries();
				break;
		}
	}

	updateFlowVisualization() {
		const flowContainer = this.panel.querySelector('.flow-visualization');
		const flowSteps = this.getFlowSteps();

		flowContainer.innerHTML = flowSteps.map((step, index) => `
            <div class="flow-step ${step.status}" data-step="${step.id}">
                <span class="flow-number">${index + 1}</span>
                <div class="flow-content">
                    <div class="flow-title">${step.title}</div>
                    <div class="flow-data">${step.data || 'No data'}</div>
                </div>
                ${index < flowSteps.length - 1 ? '<div class="flow-arrow"></div>' : ''}
            </div>
        `).join('');

		// Add hover tooltips
		flowContainer.querySelectorAll('.flow-step').forEach(step => {
			step.addEventListener('mouseenter', (e) => {
				this.showTooltip(e.target, this.getStepDetails(e.target.dataset.step));
			});
			step.addEventListener('mouseleave', () => {
				this.hideTooltip();
			});
		});
	}

	getFlowSteps() {
		const currentURL = window.location.href;
		let context = 'unknown';

		if (currentURL.includes('Student-CV-Template')) {
			context = 'cv';
		} else if (currentURL.includes('game-platform')) {
			context = 'platform';
		} else if (currentURL.includes('game-')) {
			context = 'game';
		}

		return [
			{
				id: 'cv',
				title: 'Student CV',
				data: this.flowStates.cv.data || 'GitHub username: ' + this.getGitHubUsername(),
				status: context === 'cv' ? 'active' : this.flowStates.cv.status
			},
			{
				id: 'platform',
				title: 'Game Platform',
				data: this.flowStates.platform.data || 'No platform data',
				status: context === 'platform' ? 'active' : this.flowStates.platform.status
			},
			{
				id: 'game',
				title: 'Game Level',
				data: this.flowStates.game.data || 'No game selected',
				status: context === 'game' ? 'active' : this.flowStates.game.status
			},
			{
				id: 'achievement',
				title: 'Achievement',
				data: this.flowStates.achievement.data || 'No achievement yet',
				status: this.flowStates.achievement.status
			}
		];
	}

	updateStorageView() {
		const storageView = this.panel.querySelector('#storage-view');
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
		const navHistory = this.panel.querySelector('#nav-history');

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

	updateKeyList() {
		const keyList = this.panel.querySelector('#key-list');
		const keys = this.getAchievementKeys();

		keyList.innerHTML = keys.map(key => `
            <div class="key-entry">
                <div class="key-game">${key.gameId}</div>
                <div class="key-status">${key.status}</div>
                <div class="key-preview">${key.key.substring(0, 30)}...</div>
                <div class="key-timestamp">Added: ${new Date(key.timestamp * 1000).toLocaleString()}</div>
            </div>
        `).join('');
	}

	updateLogEntries() {
		const logContainer = this.panel.querySelector('#log-entries');
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

		console.log(`%c[Debug] ${message}`, consoleStyles[type] || '');
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

		// Update flow states based on navigation
		this.updateFlowBasedOnNavigation(from, to);

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

	updateFlowBasedOnNavigation(from, to) {
		// Update flow states based on navigation patterns
		if (from === 'Student CV' && to === 'Game Platform') {
			this.flowStates.cv.status = 'completed';
			this.flowStates.platform.status = 'active';
		} else if (from === 'Game Platform' && to.startsWith('Game:')) {
			this.flowStates.platform.status = 'completed';
			this.flowStates.game.status = 'active';
			this.flowStates.game.data = to;
		} else if (from.startsWith('Game:') && to === 'Game Platform') {
			this.flowStates.game.status = 'completed';
			this.flowStates.achievement.status = 'active';
		} else if (from === 'Game Platform' && to === 'Student CV') {
			this.flowStates.achievement.status = 'completed';
			this.flowStates.cv.status = 'active';
		}
	}

	clearLogs() {
		this.logs = [];
		if (this.isVisible) {
			this.updateLogEntries();
		}
		this.log('Logs cleared', 'info');
	}

	// Helper methods
	getGitHubUsername() {
		const url = window.location.href;
		const match = url.match(/https?:\/\/([^.]+)\.github\.io/i);
		return match ? match[1] : null;
	}

	getAchievementKeys() {
		try {
			const keys = JSON.parse(localStorage.getItem('verifiedKeys') || '[]');
			return keys.map(key => {
				try {
					const decodedKey = JSON.parse(atob(key));
					return {
						gameId: decodedKey.gameId,
						status: 'Verified',
						key: key,
						timestamp: decodedKey.timestamp
					};
				} catch {
					return {
						gameId: 'Unknown',
						status: 'Invalid',
						key: key,
						timestamp: null
					};
				}
			});
		} catch {
			return [];
		}
	}

	getStepDetails(stepId) {
		const details = {
			cv: 'The student\'s personal CV page that tracks achievements and displays skills progress.',
			platform: 'Central hub for accessing all learning games. Tracks completion status.',
			game: 'Interactive learning games that teach specific skills through challenges.',
			achievement: 'Achievement keys awarded upon game completion, used to update CV.'
		};
		return details[stepId] || 'No details available';
	}

	showTooltip(element, text) {
		let tooltip = document.querySelector('.debug-tooltip');
		if (!tooltip) {
			tooltip = document.createElement('div');
			tooltip.className = 'debug-tooltip';
			document.body.appendChild(tooltip);
		}

		tooltip.textContent = text;
		tooltip.classList.add('visible');

		const rect = element.getBoundingClientRect();
		tooltip.style.left = `${rect.left}px`;
		tooltip.style.top = `${rect.bottom + 5}px`;
	}

	hideTooltip() {
		const tooltip = document.querySelector('.debug-tooltip');
		if (tooltip) {
			tooltip.classList.remove('visible');
		}
	}

	// Advanced debugging features
	inspect(object) {
		if (!this.enabled) return;

		console.group('Debug Inspector');
		console.log(object);
		console.trace();
		console.groupEnd();
	}

	watchValue(key, callback) {
		if (!this.enabled) return;

		const value = localStorage.getItem(key);

		// Create a proxy for localStorage
		const handler = {
			set: (target, prop, value) => {
				if (prop === key) {
					callback(key, value);
				}
				return Reflect.set(target, prop, value);
			}
		};

		const proxy = new Proxy(localStorage, handler);

		// Replace the original setItem
		const originalSetItem = localStorage.setItem;
		localStorage.setItem = function (k, v) {
			if (k === key) {
				callback(k, v);
			}
			return originalSetItem.call(localStorage, k, v);
		};
	}

	exportDebugData() {
		const debugData = {
			logs: this.logs,
			navigationHistory: this.navigationHistory,
			flowStates: this.flowStates,
			localStorage: {},
			timestamp: new Date().toISOString()
		};

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			try {
				debugData.localStorage[key] = JSON.parse(localStorage.getItem(key));
			} catch {
				debugData.localStorage[key] = localStorage.getItem(key);
			}
		}

		const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `debug-export-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	importDebugData(file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target.result);
				this.logs = data.logs || [];
				this.navigationHistory = data.navigationHistory || [];
				this.flowStates = data.flowStates || this.flowStates;

				if (this.isVisible) {
					this.refreshAllTabs();
				}

				this.log('Debug data imported successfully', 'success');
			} catch (error) {
				this.log('Failed to import debug data', 'error', error);
			}
		};
		reader.readAsText(file);
	}

	refreshAllTabs() {
		['flow', 'storage', 'navigation', 'keys', 'logs'].forEach(tab => {
			this.refreshTabContent(tab);
		});
	}
}

// Create global debug instance
window.debugVisualizer = new DebugVisualizer();

// Attach to window.debug for compatibility
window.debug = {
	...window.debug,
	log: (message, type, data) => window.debugVisualizer.log(message, type, data),
	trackNavigation: (from, to, data) => window.debugVisualizer.trackNavigation(from, to, data),
	updateFlowState: (step, status, data) => window.debugVisualizer.updateFlowState(step, status, data),
	toggle: () => window.debugVisualizer.toggle(),
	enable: () => window.debugVisualizer.enable(),
	disable: () => window.debugVisualizer.disable(),
	inspect: (object) => window.debugVisualizer.inspect(object),
	watch: (key, callback) => window.debugVisualizer.watchValue(key, callback),
	export: () => window.debugVisualizer.exportDebugData(),
	import: (file) => window.debugVisualizer.importDebugData(file)
};

// Auto-enable if debug parameter is present
if (window.location.search.includes('debug=true')) {
	window.debugVisualizer.enable();
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = DebugVisualizer;
}