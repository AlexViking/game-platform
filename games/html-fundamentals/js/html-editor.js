/**
 * HTML Editor functionality for HTML Fundamentals game
 */

class HTMLEditor {
	constructor(editorId, previewId) {
		this.editor = document.getElementById(editorId);
		this.preview = document.getElementById(previewId);
		this.setupEditor();
	}

	setupEditor() {
		if (!this.editor || !this.preview) return;

		// Add event listener for real-time preview
		this.editor.addEventListener('input', () => {
			this.updatePreview();
		});

		// Initial preview update
		this.updatePreview();
	}

	updatePreview() {
		const code = this.editor.value;

		// Create a safe iframe content
		const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; }
                </style>
            </head>
            <body>
                ${code}
            </body>
            </html>
        `;

		// Update iframe content
		const iframeDoc = this.preview.contentDocument || this.preview.contentWindow.document;
		iframeDoc.open();
		iframeDoc.write(previewContent);
		iframeDoc.close();
	}

	getCode() {
		return this.editor.value;
	}

	setCode(code) {
		this.editor.value = code;
		this.updatePreview();
	}

	validateCode(requirements) {
		const code = this.getCode();
		const doc = new DOMParser().parseFromString(code, 'text/html');
		const body = doc.body;

		const results = {
			valid: true,
			errors: [],
			warnings: []
		};

		// Check element requirements
		if (requirements.elements) {
			requirements.elements.forEach(req => {
				const elements = body.getElementsByTagName(req.element);
				if (elements.length < req.minCount) {
					results.valid = false;
					results.errors.push(`Missing ${req.description}. Found: ${elements.length}, Required: ${req.minCount}`);
				}
			});
		}

		// Check attribute requirements
		if (requirements.attributes) {
			requirements.attributes.forEach(req => {
				const elements = body.getElementsByTagName(req.element);
				Array.from(elements).forEach(el => {
					if (req.required && !el.hasAttribute(req.attribute)) {
						results.valid = false;
						results.errors.push(`${req.element} element missing ${req.attribute} attribute`);
					}
				});
			});
		}

		return results;
	}
}

// Practice editor handler
class PracticeHandler {
	constructor() {
		this.editor = new HTMLEditor('code-editor', 'preview-frame');
		this.setupCheckButton();
	}

	setupCheckButton() {
		const checkButton = document.querySelector('.btn-check-code');
		if (checkButton) {
			checkButton.addEventListener('click', () => {
				this.checkCode();
			});
		}
	}

	checkCode() {
		const practiceId = 'practice-1';
		const requirements = GAME_CONFIG.practiceExercises[practiceId].requirements;
		const results = this.editor.validateCode({ elements: requirements });

		const feedbackElement = document.querySelector('#practice-1 .feedback');

		if (results.valid) {
			feedbackElement.textContent = 'Excellent! Your code meets all requirements.';
			feedbackElement.className = 'feedback correct';
			feedbackElement.style.display = 'block';

			// Show next button
			const checkButton = document.querySelector('.btn-check-code');
			const nextButton = checkButton.nextElementSibling;
			checkButton.style.display = 'none';
			nextButton.style.display = 'inline-block';

			window.debug.log('Practice exercise completed successfully', 'success');
		} else {
			feedbackElement.innerHTML = 'Try again! Issues found:<br>' + results.errors.join('<br>');
			feedbackElement.className = 'feedback incorrect';
			feedbackElement.style.display = 'block';

			window.debug.log('Practice exercise has errors', 'error', results.errors);
		}
	}
}

// Challenge editor handler
class ChallengeHandler {
	constructor() {
		this.editor = new HTMLEditor('challenge-editor', 'challenge-preview');
		this.setupCheckButton();
	}

	setupCheckButton() {
		const checkButton = document.querySelector('.btn-check-challenge');
		if (checkButton) {
			checkButton.addEventListener('click', () => {
				this.checkChallenge();
			});
		}
	}

	checkChallenge() {
		const requirements = GAME_CONFIG.challengeRequirements;
		const results = this.editor.validateCode(requirements);

		const feedbackElement = document.querySelector('#challenge .feedback');

		if (results.valid) {
			feedbackElement.textContent = 'Excellent! You\'ve successfully completed the challenge!';
			feedbackElement.className = 'feedback correct';
			feedbackElement.style.display = 'block';

			// Show complete button
			const checkButton = document.querySelector('.btn-check-challenge');
			const completeButton = document.querySelector('.btn-complete');
			checkButton.style.display = 'none';
			completeButton.style.display = 'inline-block';

			window.debug.log('Challenge completed successfully', 'success');
		} else {
			feedbackElement.innerHTML = 'Not quite! Issues found:<br>' + results.errors.join('<br>');
			feedbackElement.className = 'feedback incorrect';
			feedbackElement.style.display = 'block';

			window.debug.log('Challenge has errors', 'error', results.errors);
		}
	}
}

// Initialize editors when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	// Initialize practice handler
	window.practiceHandler = new PracticeHandler();

	// Initialize challenge handler
	window.challengeHandler = new ChallengeHandler();

	// Add syntax highlighting styles
	const style = document.createElement('style');
	style.textContent = `
        .code-editor {
            width: 100%;
            min-height: 200px;
            padding: 15px;
            font-family: monospace;
            background-color: var(--dark-color);
            border: 2px solid var(--border-color);
            color: var(--text-color);
            resize: vertical;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
        }
        
        .editor-header, .preview-header {
            background-color: var(--primary-color);
            color: var(--dark-color);
            padding: 5px 10px;
            font-size: 12px;
        }
        
        .preview-frame {
            width: 100%;
            min-height: 200px;
            background-color: white;
            border: 2px solid var(--border-color);
        }
        
        .practice-container, .challenge-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        @media (max-width: 768px) {
            .practice-container, .challenge-container {
                grid-template-columns: 1fr;
            }
        }
        
        .tag { color: var(--primary-color); }
        .attr { color: var(--secondary-color); }
        .value { color: var(--accent-color); }
    `;
	document.head.appendChild(style);
});