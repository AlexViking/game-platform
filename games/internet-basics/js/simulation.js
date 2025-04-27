/**
 * Interactive HTTP Simulation
 * Simulates the request-response cycle of the internet
 */

class HTTPSimulation {
	constructor() {
		this.isRunning = false;
		this.setupEventListeners();
	}

	setupEventListeners() {
		const requestButton = document.getElementById('sim-request-btn');
		const speedSelect = document.getElementById('sim-speed');

		if (requestButton) {
			requestButton.addEventListener('click', () => {
				if (!this.isRunning) {
					this.startSimulation(speedSelect.value);
				}
			});
		}
	}

	startSimulation(speed) {
		this.isRunning = true;
		const requestButton = document.getElementById('sim-request-btn');
		requestButton.disabled = true;

		// Reset simulation
		this.resetSimulation();

		// Get timing based on speed
		const timing = this.getSimulationSpeed(speed);

		// Run simulation
		this.runHTTPSimulation(timing)
			.then(() => {
				this.isRunning = false;
				requestButton.disabled = false;

				// Show next button
				const nextButton = document.querySelector('#interactive-demo .btn-next');
				if (nextButton) {
					nextButton.style.display = 'inline-block';
				}

				// Update debug flow
				window.debug.updateFlowState('simulation', 'completed', 'HTTP simulation complete');
			})
			.catch(error => {
				console.error('Simulation error:', error);
				this.addLogEntry('Error in simulation', 'error');
				this.isRunning = false;
				requestButton.disabled = false;
			});
	}

	getSimulationSpeed(speedSetting) {
		const speeds = {
			slow: {
				dns: 2000,
				connection: 1500,
				request: 1000,
				serverProcessing: 2000,
				response: 1500,
				rendering: 2000,
				step: 500
			},
			medium: {
				dns: 1000,
				connection: 800,
				request: 500,
				serverProcessing: 1000,
				response: 800,
				rendering: 1000,
				step: 300
			},
			fast: {
				dns: 300,
				connection: 200,
				request: 150,
				serverProcessing: 400,
				response: 300,
				rendering: 500,
				step: 100
			}
		};

		return speeds[speedSetting] || speeds.medium;
	}

	resetSimulation() {
		// Clear browser content
		const loadingDiv = document.querySelector('.sim-browser-content .sim-loading');
		const contentDiv = document.querySelector('.sim-browser-content .sim-content');

		if (loadingDiv) loadingDiv.style.display = 'flex';
		if (contentDiv) contentDiv.style.display = 'none';

		// Reset server status
		const serverStatus = document.querySelector('.server-status');
		if (serverStatus) {
			serverStatus.textContent = 'Ready';
			serverStatus.style.color = 'var(--success-color)';
			serverStatus.style.backgroundColor = 'rgba(28, 200, 138, 0.1)';
		}

		// Hide network packets
		const requestPacket = document.querySelector('.sim-request-packet');
		const responsePacket = document.querySelector('.sim-response-packet');

		if (requestPacket) requestPacket.style.display = 'none';
		if (responsePacket) responsePacket.style.display = 'none';

		// Clear log entries
		const logEntries = document.querySelector('.log-entries');
		if (logEntries) logEntries.innerHTML = '';
	}

	async runHTTPSimulation(speed) {
		// 1. DNS Lookup
		this.addLogEntry('DNS Lookup: Resolving example.com...', 'info');
		await GameUtils.delay(speed.dns);
		this.addLogEntry('DNS Resolved: example.com -> 192.168.0.1', 'success');

		await GameUtils.delay(speed.step);

		// 2. Establishing connection
		this.addLogEntry('TCP: Opening connection to 192.168.0.1:443...', 'info');
		await GameUtils.delay(speed.connection);
		this.addLogEntry('TCP: Connection established', 'success');

		await GameUtils.delay(speed.step);

		// 3. Sending HTTP request
		this.addLogEntry('HTTP: Sending GET request to /index.html', 'info');
		this.animateRequestPacket(speed.request);
		await GameUtils.delay(speed.request);

		// 4. Server processing
		const serverStatus = document.querySelector('.server-status');
		if (serverStatus) {
			serverStatus.textContent = 'Processing';
			serverStatus.style.color = 'var(--warning-color)';
			serverStatus.style.backgroundColor = 'rgba(246, 194, 62, 0.1)';
		}

		this.addLogEntry('Server: Processing request...', 'info');
		await GameUtils.delay(speed.serverProcessing);

		// 5. Server sending response
		if (serverStatus) {
			serverStatus.textContent = 'Sending';
		}
		this.addLogEntry('Server: Sending response (200 OK)', 'success');
		this.animateResponsePacket(speed.response);
		await GameUtils.delay(speed.response);

		// 6. Browser rendering
		if (serverStatus) {
			serverStatus.textContent = 'Ready';
			serverStatus.style.color = 'var(--success-color)';
			serverStatus.style.backgroundColor = 'rgba(28, 200, 138, 0.1)';
		}

		this.addLogEntry('HTTP: Response received (200 OK, 1.2KB)', 'success');
		await GameUtils.delay(speed.step);

		this.addLogEntry('Browser: Parsing HTML...', 'info');

		const loadingDiv = document.querySelector('.sim-browser-content .sim-loading');
		const contentDiv = document.querySelector('.sim-browser-content .sim-content');

		if (loadingDiv) loadingDiv.style.display = 'none';
		if (contentDiv) contentDiv.style.display = 'block';

		await GameUtils.delay(speed.rendering);

		this.addLogEntry('Browser: Page rendered successfully', 'success');
	}

	animateRequestPacket(duration) {
		const packet = document.querySelector('.sim-request-packet');
		if (!packet) return;

		const startPos = 20;
		const endPos = 380;

		// Show packet
		packet.style.display = 'block';
		packet.style.left = startPos + 'px';
		packet.style.top = '50%';

		// Animate
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			const currentPos = startPos + (endPos - startPos) * progress;
			packet.style.left = currentPos + 'px';

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				packet.style.display = 'none';
			}
		};

		requestAnimationFrame(animate);
	}

	animateResponsePacket(duration) {
		const packet = document.querySelector('.sim-response-packet');
		if (!packet) return;

		const startPos = 380;
		const endPos = 20;

		// Show packet
		packet.style.display = 'block';
		packet.style.left = startPos + 'px';
		packet.style.top = '50%';

		// Animate
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);

			const currentPos = startPos + (endPos - startPos) * progress;
			packet.style.left = currentPos + 'px';

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				packet.style.display = 'none';
			}
		};

		requestAnimationFrame(animate);
	}

	addLogEntry(message, type = 'info') {
		const logContainer = document.querySelector('.log-entries');
		if (!logContainer) return;

		const now = new Date();
		const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

		const logEntry = document.createElement('div');
		logEntry.className = 'log-entry';

		logEntry.innerHTML = `
            <span class="log-time">[${timeString}]</span>
            <span class="log-${type}">${message}</span>
        `;

		logContainer.appendChild(logEntry);
		logContainer.scrollTop = logContainer.scrollHeight;
	}
}

// Initialize simulation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	window.httpSimulation = new HTTPSimulation();
});