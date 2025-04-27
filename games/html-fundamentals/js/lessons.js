/**
 * Lesson Content for HTML Fundamentals
 */

const LESSONS = {
	'lesson-1': {
		title: 'HTML Basics',
		content: `
            <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web content.</p>
            
            <div class="interactive-diagram">
                <div class="html-structure">
                    <pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;Page Title&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;h1&gt;This is a Heading&lt;/h1&gt;
        &lt;p&gt;This is a paragraph.&lt;/p&gt;
    &lt;/body&gt;
&lt;/html&gt;</code></pre>
                </div>
                <div class="structure-explanation">
                    <p>Every HTML document consists of:</p>
                    <ul>
                        <li><strong>&lt;!DOCTYPE html&gt;</strong>: Declaration that this is an HTML5 document</li>
                        <li><strong>&lt;html&gt;</strong>: Root element of the page</li>
                        <li><strong>&lt;head&gt;</strong>: Contains meta information</li>
                        <li><strong>&lt;body&gt;</strong>: Contains the visible page content</li>
                    </ul>
                </div>
            </div>
            
            <p>HTML elements are defined by tags, which typically come in pairs: an opening tag and a closing tag.</p>
        `
	},

	'lesson-2': {
		title: 'Common HTML Elements',
		content: `
            <p>HTML provides many elements for different types of content:</p>
            
            <div class="element-showcase">
                <div class="element-group">
                    <h4>Text Elements</h4>
                    <ul>
                        <li><code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> - Headings</li>
                        <li><code>&lt;p&gt;</code> - Paragraphs</li>
                        <li><code>&lt;strong&gt;</code> - Bold text</li>
                        <li><code>&lt;em&gt;</code> - Italic text</li>
                    </ul>
                </div>
                
                <div class="element-group">
                    <h4>Lists</h4>
                    <ul>
                        <li><code>&lt;ul&gt;</code> - Unordered list</li>
                        <li><code>&lt;ol&gt;</code> - Ordered list</li>
                        <li><code>&lt;li&gt;</code> - List item</li>
                    </ul>
                </div>
                
                <div class="element-group">
                    <h4>Links and Media</h4>
                    <ul>
                        <li><code>&lt;a href="url"&gt;</code> - Links</li>
                        <li><code>&lt;img src="image.jpg" alt="description"&gt;</code> - Images</li>
                        <li><code>&lt;video&gt;</code> - Video content</li>
                    </ul>
                </div>
            </div>
            
            <div class="example-code">
                <h4>Example Usage:</h4>
                <pre><code>&lt;h1&gt;Welcome to My Website&lt;/h1&gt;
&lt;p&gt;This is a &lt;strong&gt;paragraph&lt;/strong&gt; with &lt;em&gt;emphasized&lt;/em&gt; text.&lt;/p&gt;
&lt;ul&gt;
    &lt;li&gt;First item&lt;/li&gt;
    &lt;li&gt;Second item&lt;/li&gt;
&lt;/ul&gt;
&lt;a href="https://example.com"&gt;Visit Example.com&lt;/a&gt;</code></pre>
            </div>
        `
	},

	'lesson-3': {
		title: 'HTML Attributes',
		content: `
            <p>Attributes provide additional information about HTML elements. They are always specified in the opening tag.</p>
            
            <div class="attribute-explanation">
                <h4>Syntax:</h4>
                <pre><code>&lt;element attribute="value"&gt;Content&lt;/element&gt;</code></pre>
                
                <h4>Common Attributes:</h4>
                <ul>
                    <li><strong>id</strong>: Unique identifier for an element</li>
                    <li><strong>class</strong>: Class name for styling or JavaScript</li>
                    <li><strong>style</strong>: Inline CSS styles</li>
                    <li><strong>title</strong>: Additional information (tooltip)</li>
                </ul>
                
                <h4>Element-Specific Attributes:</h4>
                <ul>
                    <li><strong>href</strong>: URL for links (&lt;a&gt;)</li>
                    <li><strong>src</strong>: Source URL for images and media</li>
                    <li><strong>alt</strong>: Alternative text for images</li>
                    <li><strong>width</strong> and <strong>height</strong>: Dimensions for images</li>
                </ul>
            </div>
            
            <div class="attribute-examples">
                <h4>Examples:</h4>
                <pre><code>&lt;a href="https://example.com" target="_blank"&gt;Open in new tab&lt;/a&gt;
&lt;img src="photo.jpg" alt="A beautiful sunset" width="300"&gt;
&lt;p id="intro" class="highlight"&gt;Introduction text&lt;/p&gt;
&lt;div style="color: blue;"&gt;Blue text&lt;/div&gt;</code></pre>
            </div>
            
            <div class="best-practices">
                <h4>Best Practices:</h4>
                <ul>
                    <li>Always use alt attributes for images</li>
                    <li>Use semantic HTML elements when possible</li>
                    <li>Keep IDs unique within a page</li>
                    <li>Use lowercase for attribute names</li>
                </ul>
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
		}

		window.debug.log(`Loaded lesson: ${lessonId}`, 'info');
	}

	highlightCode() {
		// Simple syntax highlighting for HTML
		const codeBlocks = document.querySelectorAll('pre code');
		codeBlocks.forEach(block => {
			let html = block.innerHTML;

			// Highlight tags
			html = html.replace(/&lt;([^&]+)&gt;/g, '<span class="tag">&lt;$1&gt;</span>');

			// Highlight attributes
			html = html.replace(/(\w+)="([^"]*)"/g, '<span class="attr">$1</span>=<span class="value">"$2"</span>');

			block.innerHTML = html;
		});
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