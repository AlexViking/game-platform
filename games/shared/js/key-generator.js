/**
 * Shared Achievement Key Generator
 */

const KeyGenerator = {
	/**
	 * Generate an achievement key for completed game
	 */
	generateKey(gameId, achievements, studentId) {
		if (!studentId) {
			window.debug.log('No student ID found. Using anonymous mode.', 'warning');
			studentId = 'anonymous';
		}

		// Create achievement data with student-specific information
		const achievementData = {
			gameId: gameId,
			studentId: studentId,
			timestamp: Math.floor(Date.now() / 1000),
			ipHash: this.generateIPHash(),
			deviceId: this.generateDeviceId(),
			completionTime: this.getCompletionTime(),
			achievements: achievements,
			signature: ""
		};

		// Generate signature
		achievementData.signature = this.generateHMAC(achievementData);

		// Convert to JSON string and encode as Base64
		const jsonString = JSON.stringify(achievementData);
		return btoa(jsonString);
	},

	/**
	 * Generate a simple hash based on IP-like information
	 */
	generateIPHash() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Draw something unique based on graphics hardware
		ctx.textBaseline = "top";
		ctx.font = "14px 'Arial'";
		ctx.textBaseline = "alphabetic";
		ctx.fillStyle = "#f60";
		ctx.fillRect(125, 1, 62, 20);
		ctx.fillStyle = "#069";
		ctx.fillText("IP:Identifier", 2, 15);

		// Get canvas data and hash it
		const dataURL = canvas.toDataURL();
		return this.hashString(dataURL.substr(0, 50));
	},

	/**
	 * Generate a device identifier based on browser characteristics
	 */
	generateDeviceId() {
		// Collect various browser properties
		const screenProps = `${screen.height}x${screen.width}x${screen.colorDepth}`;
		const timeZone = new Date().getTimezoneOffset();
		const langs = navigator.languages ? navigator.languages.join(',') : navigator.language;
		const platformInfo = navigator.platform;
		const userAgent = navigator.userAgent;

		// Combine all properties and hash
		const deviceString = `${screenProps}|${timeZone}|${langs}|${platformInfo}|${userAgent}`;
		return this.hashString(deviceString);
	},

	/**
	 * Get the time spent completing the game
	 */
	getCompletionTime() {
		const startTime = window.gameEngine?.gameState.startTime || Date.now() - 600000;
		const endTime = Date.now();
		const completionTime = Math.floor((endTime - startTime) / 1000);

		// Sanity check
		if (completionTime < 60) {
			return 600; // Default to 10 minutes
		}

		return completionTime;
	},

	/**
	 * Generate a hash from a string
	 */
	hashString(str) {
		let hash = 0;

		if (str.length === 0) return hash.toString(16);

		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}

		return hash.toString(16).replace('-', 'n');
	},

	/**
	 * Generate an HMAC signature
	 */
	generateHMAC(data) {
		// Create a copy of the data without the signature
		const dataForSigning = { ...data };
		delete dataForSigning.signature;

		// Convert to a string
		const dataString = JSON.stringify(dataForSigning);

		// Combine with a "secret key"
		const secretKey = "CV_PLATFORM_SECRET_KEY_2025";

		// Create a hash of the combined string
		const combinedString = secretKey + dataString + secretKey;
		return this.hashString(combinedString);
	},

	/**
	 * Validate a key (used for debugging)
	 */
	validateKey(keyString) {
		try {
			const decodedString = atob(keyString);
			const keyData = JSON.parse(decodedString);

			// Check required fields
			const requiredFields = ['gameId', 'studentId', 'timestamp', 'achievements', 'signature'];
			for (const field of requiredFields) {
				if (!keyData[field]) {
					return { valid: false, error: `Missing ${field}` };
				}
			}

			// Verify signature
			const originalSignature = keyData.signature;
			delete keyData.signature;
			const recalculatedSignature = this.generateHMAC(keyData);

			if (originalSignature !== recalculatedSignature) {
				return { valid: false, error: 'Invalid signature' };
			}

			return { valid: true, data: keyData };
		} catch (error) {
			return { valid: false, error: error.message };
		}
	}
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = KeyGenerator;
}