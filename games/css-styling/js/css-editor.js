/**
 * CSS Editor functionality for CSS Styling game
 */

class CSSEditor {
	constructor(cssEditorId, htmlViewerId, previewId) {
		this.cssEditor = document.getElementById(cssEditorId);
		this.htmlViewer = document.getElementById(htmlViewerId);
		this.preview = document.getElementById(previewId);
		this.setupEditor();
	}

	setupEditor() {
		if (!this.cssEditor || !this.preview) return;

		// Add event listener for real-time preview
		this.cssEditor.addEventListener('input', () => {
			this.updatePreview();
		});

		// Initial preview update
		this.updatePreview();
	}

	updatePreview() {
		const cssCode = this.cssEditor.value;
		const htmlCode = this.htmlViewer ? this.htmlViewer.value : '';

		// Create a safe iframe content
		const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 10px; }
                    ${cssCode}
                </style>
            </head>
            <body>
                ${htmlCode}
            </body>
            </html>
        `;

		// Update iframe content
		const iframeDoc = this.preview.contentDocument || this.preview.contentWindow.document;
		iframeDoc.open();
		iframeDoc.write(previewContent);
		iframeDoc.close();
	}

	getCSS() {
		return this.cssEditor.value;
	}

	setCSS(css) {
		this.cssEditor.value = css;
		this.updatePreview();
	}

	validateCSS(requirements) {
		const css = this.getCSS();
		const results = {
			valid: true,
			errors: [],
			warnings: []
		};

		// Parse CSS
		const rules = this.parseCSS(css);

		// Check selector requirements
		if (requirements.selectors) {
			requirements.selectors.forEach(req => {
				if (req.required && !rules[req.selector]) {
					results.valid = false;
					results.errors.push(`Missing required selector: ${req.selector}`);
				}
			});
		}

		// Check property requirements
		if (requirements.properties) {
			Object.entries(requirements.properties).forEach(([selector, properties]) => {
				if (rules[selector]) {
					properties.forEach(prop => {
						if (!rules[selector][prop]) {
							results.valid = false;
							results.errors.push(`Missing ${prop} property for ${selector}`);
						}
					});
				}
			});
		}

		// Check for specific values
		if (requirements.values) {
			Object.entries(requirements.values).forEach(([selector, valueReq]) => {
				if (rules[selector]) {
					Object.entries(valueReq).forEach(([prop, expected]) => {
						const actual = rules[selector][prop];
						if (expected instanceof RegExp) {
							if (!actual || !expected.test(actual)) {
								results.valid = false;
								results.errors.push(`${selector} ${prop} should match ${expected}`);
							}
						} else if (actual !== expected) {
							results.valid = false;
							results.errors.push(`${selector} ${prop} should be ${expected}`);
						}
					});
				}
			});
		}

		return results;
	}

	parseCSS(css) {
		const rules = {};
		const ruleRegex = /([^{]+)\{([^}]+)\}/g;
		let match;

		while ((match = ruleRegex.exec(css)) !== null) {
			const selector = match[1].trim();
			const properties = match[2].trim();

			rules[selector] = {};

			const propRegex = /([^:]+):([^;]+);?/g;
			let propMatch;

			while ((propMatch = propRegex.exec(properties)) !== null) {
				const property = propMatch[1].trim();
				const value = propMatch[2].trim();
				rules[selector][property] = value;
			}
		}

		return rules;
	}
}

// Practice editor handler
class PracticeHandler {
	constructor() {
		this.editor = new CSSEditor('css-editor', 'html-viewer', 'preview-frame');
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

		// Convert requirements format
		const validationReq = {
			selectors: requirements.map(req => ({ selector: req.selector, required: true })),
			properties: {},
			values: {}
		};

		requirements.forEach(req => {
			validationReq.properties[req.selector] = req.properties;
			validationReq.values[req.selector] = req.values;
		});

		const results = this.editor.validateCSS(validationReq);
		const feedbackElement = document.querySelector('#practice-1 .feedback');

		if (results.valid) {
			feedbackElement.textContent = 'Excellent! Your CSS meets all requirements.';
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
		this.editor = new CSSEditor('challenge-css', 'challenge-html', 'challenge-preview');
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
		const results = this.editor.validateCSS(requirements);

		// Additional check for flexbox
		const css = this.editor.getCSS();
		const hasFlexbox = css.includes('display: flex') || css.includes('display:flex');

		if (!hasFlexbox) {
			results.valid = false;
			results.errors.push('Must use flexbox for layout (display: flex)');
		}

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

	// Add editor styles
	const style = document.createElement('style');
	style.textContent = `
        .editor-split-view {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .code-editor, .code-viewer {
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
        
        .code-viewer {
            background-color: rgba(24, 22, 36, 0.6);
            cursor: not-allowed;
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
        
        @media (max-width: 768px) {
            .editor-split-view {
                grid-template-columns: 1fr;
            }
        }
        
        .selector { color: var(--primary-color); }
        .property { color: var(--secondary-color); }
        .value { color: var(--accent-color); }
        .comment { color: var(--border-color); font-style: italic; }
    `;
	document.head.appendChild(style);
});