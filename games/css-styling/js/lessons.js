/**
 * Lesson Content for CSS Styling
 */

const LESSONS = {
	'lesson-1': {
		title: 'CSS Basics',
		content: `
            <p>CSS (Cascading Style Sheets) is used to style and layout web pages. It describes how HTML elements should be displayed.</p>
            
            <div class="css-syntax">
                <h4>CSS Syntax:</h4>
                <pre><code>selector {
    property: value;
}</code></pre>
                
                <div class="syntax-explanation">
                    <ul>
                        <li><strong>Selector</strong>: Targets HTML elements</li>
                        <li><strong>Property</strong>: The aspect you want to change</li>
                        <li><strong>Value</strong>: The setting for the property</li>
                    </ul>
                </div>
            </div>
            
            <div class="css-methods">
                <h4>Three Ways to Add CSS:</h4>
                <ol>
                    <li><strong>Inline</strong>: Using the style attribute</li>
                    <li><strong>Internal</strong>: Using &lt;style&gt; in the &lt;head&gt;</li>
                    <li><strong>External</strong>: Using a separate .css file</li>
                </ol>
            </div>
            
            <div class="css-example">
                <h4>Example:</h4>
                <pre><code>/* External or Internal CSS */
h1 {
    color: blue;
    font-size: 24px;
}

/* Inline CSS */
&lt;h1 style="color: blue; font-size: 24px;"&gt;Hello&lt;/h1&gt;</code></pre>
            </div>
        `
	},

	'lesson-2': {
		title: 'Selectors and Properties',
		content: `
            <p>CSS selectors are patterns used to select elements you want to style.</p>
            
            <div class="selector-types">
                <h4>Common Selector Types:</h4>
                <ul>
                    <li><strong>Element Selector</strong>: <code>p { }</code> - Selects all &lt;p&gt; elements</li>
                    <li><strong>Class Selector</strong>: <code>.highlight { }</code> - Selects elements with class="highlight"</li>
                    <li><strong>ID Selector</strong>: <code>#main { }</code> - Selects element with id="main"</li>
                    <li><strong>Attribute Selector</strong>: <code>[type="text"] { }</code> - Selects elements with specific attribute</li>
                </ul>
            </div>
            
            <div class="common-properties">
                <h4>Common CSS Properties:</h4>
                <div class="property-groups">
                    <div class="group">
                        <h5>Text Properties:</h5>
                        <ul>
                            <li><code>color</code> - Text color</li>
                            <li><code>font-size</code> - Text size</li>
                            <li><code>font-family</code> - Font type</li>
                            <li><code>text-align</code> - Text alignment</li>
                        </ul>
                    </div>
                    <div class="group">
                        <h5>Background Properties:</h5>
                        <ul>
                            <li><code>background-color</code> - Background color</li>
                            <li><code>background-image</code> - Background image</li>
                        </ul>
                    </div>
                    <div class="group">
                        <h5>Box Properties:</h5>
                        <ul>
                            <li><code>width</code> - Element width</li>
                            <li><code>height</code> - Element height</li>
                            <li><code>margin</code> - Space outside border</li>
                            <li><code>padding</code> - Space inside border</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="selector-examples">
                <h4>Examples:</h4>
                <pre><code>/* Multiple selectors */
h1, h2, h3 {
    color: navy;
}

/* Descendant selector */
.container p {
    font-size: 16px;
}

/* Pseudo-class */
a:hover {
    color: red;
}

/* Complex selector */
nav ul li a.active {
    font-weight: bold;
}</code></pre>
            </div>
        `
	},

	'lesson-3': {
		title: 'Box Model and Layout',
		content: `
            <p>The CSS Box Model is fundamental to understanding layout in CSS. Every element is a rectangular box with content, padding, border, and margin.</p>
            
            <div class="box-model-diagram">
                <h4>Box Model Components:</h4>
                <div class="box-model-visual">
                    <div class="margin-box">
                        Margin
                        <div class="border-box">
                            Border
                            <div class="padding-box">
                                Padding
                                <div class="content-box">
                                    Content
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="box-model-properties">
                <h4>Box Model Properties:</h4>
                <ul>
                    <li><strong>Content</strong>: The actual content (text, images)</li>
                    <li><strong>Padding</strong>: Space between content and border</li>
                    <li><strong>Border</strong>: Line surrounding padding/content</li>
                    <li><strong>Margin</strong>: Space outside the border</li>
                </ul>
            </div>
            
            <div class="layout-methods">
                <h4>Layout Methods:</h4>
                <ul>
                    <li><strong>Display</strong>: block, inline, inline-block, none</li>
                    <li><strong>Position</strong>: static, relative, absolute, fixed</li>
                    <li><strong>Flexbox</strong>: Modern layout system</li>
                    <li><strong>Grid</strong>: Two-dimensional layout system</li>
                </ul>
            </div>
            
            <div class="flexbox-example">
                <h4>Flexbox Example:</h4>
                <pre><code>.container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.item {
    flex: 1;
    padding: 20px;
}</code></pre>
            </div>
        `
	}
};

// Lesson content loader
class LessonManager {
	constructor() {
		this.currentLesson = null;
	}

	loadLesson(lessonId) {
		const lesson = LESSONS[lessonId];
		if (!lesson) {
			console.error(`Lesson ${lessonId} not found`);
			return;
		}

		this.currentLesson = lessonId;

		// Get lesson container
		const lessonContent = document.querySelector(`#${lessonId} .lesson-content`);
		if (lessonContent) {
			lessonContent.innerHTML = lesson.content;

			// Add syntax highlighting
			this.highlightCode();

			// Add box model styling
			this.addBoxModelStyles();
		}

		window.debug.log(`Loaded lesson: ${lessonId}`, 'info');
	}

	highlightCode() {
		// Simple syntax highlighting for CSS
		const codeBlocks = document.querySelectorAll('pre code');
		codeBlocks.forEach(block => {
			let css = block.innerHTML;

			// Highlight selectors
			css = css.replace(/([.#\w\-:,\s]+)(\s*{)/g, '<span class="selector">$1</span>$2');

			// Highlight properties
			css = css.replace(/([a-z-]+)(:)/g, '<span class="property">$1</span>$2');

			// Highlight values
			css = css.replace(/:\s*([^;}\n]+)/g, ': <span class="value">$1</span>');

			// Highlight comments
			css = css.replace(/(\/\*[^*]*\*\/)/g, '<span class="comment">$1</span>');

			block.innerHTML = css;
		});
	}

	addBoxModelStyles() {
		// Add dynamic styles for box model visualization
		const style = document.createElement('style');
		style.textContent = `
            .box-model-visual {
                width: 300px;
                margin: 20px auto;
                text-align: center;
                font-size: 12px;
            }
            
            .margin-box {
                background: rgba(255, 200, 100, 0.2);
                padding: 20px;
                border: 2px dashed #ffc864;
            }
            
            .border-box {
                background: rgba(100, 200, 255, 0.2);
                padding: 20px;
                border: 4px solid #64c8ff;
            }
            
            .padding-box {
                background: rgba(200, 255, 100, 0.2);
                padding: 20px;
                border: 2px dashed #c8ff64;
            }
            
            .content-box {
                background: rgba(255, 100, 200, 0.3);
                padding: 20px;
                border: 1px solid #ff64c8;
            }
        `;
		document.head.appendChild(style);
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { LESSONS, LessonManager };
}

// Initialize lesson manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	window.lessonManager = new LessonManager();

	// Load lessons automatically
	GAME_CONFIG.sections.forEach(section => {
		if (section.type === 'lesson') {
			window.lessonManager.loadLesson(section.id);
		}
	});
});