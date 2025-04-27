/**
 * Shared game utility functions
 */

const GameUtils = {
	/**
	 * Show notification message
	 */
	showNotification(message, type = 'info') {
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		notification.textContent = message;

		const colors = {
			success: 'var(--secondary-color)',
			error: 'var(--accent-color)',
			warning: 'var(--projects-color)',
			info: 'var(--primary-color)'
		};

		notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border: 4px solid ${colors[type]};
            background-color: var(--dark-color);
            color: var(--text-color);
            font-family: 'Press Start 2P', monospace;
            font-size: 10px;
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        `;

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.style.animation = 'slideOut 0.5s ease-out';
			setTimeout(() => {
				document.body.removeChild(notification);
			}, 500);
		}, 3000);
	},

	/**
	 * Format timestamp
	 */
	formatTimestamp(timestamp) {
		return new Date(timestamp).toLocaleString();
	},

	/**
	 * Create pixel-style loading animation
	 */
	createLoadingAnimation() {
		const loader = document.createElement('div');
		loader.className = 'pixel-loader';
		loader.innerHTML = `
            <div class="pixel-box"></div>
            <div class="pixel-box"></div>
            <div class="pixel-box"></div>
        `;
		return loader;
	},

	/**
	 * Delay function for async operations
	 */
	delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	},

	/**
	 * Generate a random ID
	 */
	generateId() {
		return Math.random().toString(36).substring(2, 15);
	},

	/**
	 * Validate student ID
	 */
	validateStudentId(studentId) {
		if (!studentId) return false;
		// Check if it's a valid GitHub username format
		return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(studentId);
	},

	/**
	 * Parse URL parameters
	 */
	parseUrlParams() {
		const params = {};
		const urlParams = new URLSearchParams(window.location.search);

		for (const [key, value] of urlParams) {
			// Try to parse JSON values
			try {
				params[key] = JSON.parse(value);
			} catch {
				params[key] = value;
			}
		}

		return params;
	},

	/**
	 * Update URL parameters without reload
	 */
	updateUrlParams(params) {
		const url = new URL(window.location.href);

		Object.entries(params).forEach(([key, value]) => {
			if (value === null || value === undefined) {
				url.searchParams.delete(key);
			} else {
				url.searchParams.set(key, typeof value === 'object' ? JSON.stringify(value) : value);
			}
		});

		window.history.replaceState({}, '', url);
	},

	/**
	 * Check if game is in debug mode
	 */
	isDebugMode() {
		return window.location.search.includes('debug=true') || localStorage.getItem('debugMode') === 'true';
	},

	/**
	 * Create a pixel-styled dialog
	 */
	createDialog(title, content, buttons = []) {
		const dialog = document.createElement('div');
		dialog.className = 'pixel-dialog';

		const dialogContent = `
            <div class="dialog-header">
                <h3>${title}</h3>
                <button class="dialog-close">×</button>
            </div>
            <div class="dialog-content">
                ${content}
            </div>
            <div class="dialog-buttons">
                ${buttons.map(btn => `
                    <button class="pixel-btn ${btn.className || ''}" data-action="${btn.action}">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        `;

		dialog.innerHTML = dialogContent;

		// Style the dialog
		dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--dark-color);
            border: 4px solid var(--primary-color);
            padding: 20px;
            z-index: 1000;
            min-width: 300px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        `;

		// Add overlay
		const overlay = document.createElement('div');
		overlay.className = 'dialog-overlay';
		overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 999;
        `;

		document.body.appendChild(overlay);
		document.body.appendChild(dialog);

		// Event listeners
		dialog.querySelector('.dialog-close').addEventListener('click', () => {
			document.body.removeChild(dialog);
			document.body.removeChild(overlay);
		});

		dialog.querySelectorAll('.dialog-buttons button').forEach(button => {
			button.addEventListener('click', (e) => {
				const action = e.target.dataset.action;
				if (action) {
					window.dispatchEvent(new CustomEvent('dialogAction', { detail: { action } }));
				}
				document.body.removeChild(dialog);
				document.body.removeChild(overlay);
			});
		});

		return dialog;
	},

	/**
	 * Animate element with pixel effect
	 */
	pixelAnimate(element, animation) {
		element.style.animation = animation;
		element.addEventListener('animationend', () => {
			element.style.animation = '';
		}, { once: true });
	}
};

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .pixel-loader {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }
    
    .pixel-box {
        width: 10px;
        height: 10px;
        background-color: var(--primary-color);
        animation: pixelBounce 0.6s infinite alternate;
    }
    
    .pixel-box:nth-child(2) { animation-delay: 0.2s; }
    .pixel-box:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes pixelBounce {
        from { transform: translateY(0); }
        to { transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = GameUtils;
}