/**
 * Platform utility functions
 */

const PlatformUtils = {
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
		}, PLATFORM_CONFIG.UI.NOTIFICATION_DURATION);
	},

	/**
	 * Check if user is returning from CV
	 */
	isReturnFromCV() {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.has('return_from_cv');
	},

	/**
	 * Get student data from URL or localStorage
	 */
	getStudentData() {
		const urlParams = new URLSearchParams(window.location.search);

		return {
			studentId: urlParams.get('student') || localStorage.getItem('studentId'),
			completedGames: JSON.parse(urlParams.get('completed') || localStorage.getItem('completedGames') || '[]'),
			returnUrl: urlParams.get('return_url') || localStorage.getItem('cvReturnUrl')
		};
	},

	/**
	 * Save data to localStorage
	 */
	saveToStorage(key, value) {
		try {
			const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
			localStorage.setItem(key, stringValue);
			window.debug.log(`Saved to storage: ${key}`, 'info');
		} catch (error) {
			window.debug.log(`Failed to save to storage: ${key}`, 'error', error);
		}
	},

	/**
	 * Get data from localStorage
	 */
	getFromStorage(key, defaultValue = null) {
		try {
			const value = localStorage.getItem(key);
			if (value === null) return defaultValue;

			// Try to parse as JSON
			try {
				return JSON.parse(value);
			} catch {
				return value;
			}
		} catch (error) {
			window.debug.log(`Failed to get from storage: ${key}`, 'error', error);
			return defaultValue;
		}
	},

	/**
	 * Format timestamp for display
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
	 * Clean URL parameters
	 */
	cleanURLParams() {
		window.history.replaceState({}, document.title, window.location.pathname);
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
	module.exports = PlatformUtils;
}