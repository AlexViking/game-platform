/**
 * Lesson Content for Internet Basics
 */

const LESSONS = {
	'lesson-1': {
		title: 'What is the Internet?',
		content: `
            <p>The Internet is a global network of interconnected computers that communicate using standardized protocols.</p>
            
            <div class="interactive-diagram">
                <div class="diagram-container">
                    <img src="assets/images/internet-network.svg" alt="Internet network diagram" class="placeholder-image">
                </div>
                <div class="diagram-description">
                    <p>The internet consists of:</p>
                    <ul>
                        <li><strong>Clients</strong>: Computers, phones, and other devices used by people</li>
                        <li><strong>Servers</strong>: Computers that store and provide information</li>
                        <li><strong>Routers</strong>: Devices that direct traffic between networks</li>
                        <li><strong>ISPs</strong>: Internet Service Providers that connect you to the network</li>
                    </ul>
                </div>
            </div>
            
            <p>When you access a website, your device (client) sends a request through this network to a server, which responds with the requested information.</p>
        `,
		interactiveElements: [
			{
				id: 'network-diagram',
				type: 'diagram',
				data: {
					nodes: ['Client', 'Router', 'ISP', 'Server'],
					connections: [
						['Client', 'Router'],
						['Router', 'ISP'],
						['ISP', 'Server']
					]
				}
			}
		]
	},

	'lesson-2': {
		title: 'How HTTP Works',
		content: `
            <p>HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the web. It's how browsers and servers talk to each other.</p>
            
            <div class="http-demo">
                <div class="http-flow">
                    <div class="http-client">
                        <div class="device-icon">💻</div>
                        <div class="device-label">Client</div>
                    </div>
                    
                    <div class="http-arrows">
                        <div class="arrow-right">
                            <span class="arrow-body">→</span>
                            <span class="arrow-label">HTTP Request</span>
                        </div>
                        <div class="arrow-left">
                            <span class="arrow-body">←</span>
                            <span class="arrow-label">HTTP Response</span>
                        </div>
                    </div>
                    
                    <div class="http-server">
                        <div class="device-icon">🖥️</div>
                        <div class="device-label">Server</div>
                    </div>
                </div>
                
                <div class="http-details">
                    <div class="http-request">
                        <h4>HTTP Request Example:</h4>
                        <pre><code>GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html</code></pre>
                    </div>
                    
                    <div class="http-response">
                        <h4>HTTP Response Example:</h4>
                        <pre><code>HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html>...</html></code></pre>
                    </div>
                </div>
            </div>
            
            <p>Each HTTP request contains:</p>
            <ul>
                <li>A method (GET, POST, etc.)</li>
                <li>A URL path</li>
                <li>HTTP version</li>
                <li>Headers with additional information</li>
            </ul>
            
            <p>Each HTTP response contains:</p>
            <ul>
                <li>Status code (200 OK, 404 Not Found, etc.)</li>
                <li>Headers with metadata</li>
                <li>The requested content</li>
            </ul>
        `,
		interactiveElements: [
			{
				id: 'http-flow',
				type: 'animation',
				data: {
					steps: [
						{ element: 'request', duration: 1000 },
						{ element: 'response', duration: 1000 }
					]
				}
			}
		]
	},

	'lesson-3': {
		title: 'How Browsers Work',
		content: `
            <p>Web browsers are the software applications we use to access websites. They interpret HTML, CSS, and JavaScript to render web pages.</p>
            
            <div class="browser-workflow">
                <h4>Browser Rendering Process:</h4>
                <div class="workflow-steps">
                    <div class="workflow-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h5>Parse HTML</h5>
                            <p>Browser reads HTML and creates DOM (Document Object Model)</p>
                        </div>
                    </div>
                    
                    <div class="workflow-step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h5>Load Resources</h5>
                            <p>Fetch CSS, JavaScript, images, and other resources</p>
                        </div>
                    </div>
                    
                    <div class="workflow-step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h5>Parse CSS</h5>
                            <p>Create CSSOM (CSS Object Model)</p>
                        </div>
                    </div>
                    
                    <div class="workflow-step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h5>Execute JavaScript</h5>
                            <p>Run scripts that may modify DOM and CSSOM</p>
                        </div>
                    </div>
                    
                    <div class="workflow-step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h5>Render Tree</h5>
                            <p>Combine DOM and CSSOM into a render tree</p>
                        </div>
                    </div>
                    
                    <div class="workflow-step">
                        <div class="step-number">6</div>
                        <div class="step-content">
                            <h5>Layout</h5>
                            <p>Calculate position and size of all elements</p>
                        </div>
                    </div>
                    
                    <div class="workflow-step">
                        <div class="step-number">7</div>
                        <div class="step-content">
                            <h5>Paint</h5>
                            <p>Convert layout to pixels on the screen</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <p>This process happens every time you load a webpage, and parts of it repeat when you interact with the page (clicking buttons, scrolling, etc.).</p>
        `,
		interactiveElements: [
			{
				id: 'browser-workflow',
				type: 'interactive-workflow',
				data: {
					steps: 7,
					interactive: true
				}
			}
		]
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

			// Initialize interactive elements
			if (lesson.interactiveElements) {
				this.initializeInteractiveElements(lesson.interactiveElements);
			}
		}

		window.debug.log(`Loaded lesson: ${lessonId}`, 'info');
	}

	initializeInteractiveElements(elements) {
		elements.forEach(element => {
			switch (element.type) {
				case 'diagram':
					this.initializeDiagram(element);
					break;
				case 'animation':
					this.initializeAnimation(element);
					break;
				case 'interactive-workflow':
					this.initializeWorkflow(element);
					break;
			}
		});
	}

	initializeDiagram(element) {
		// Initialize interactive diagram
		// This would be implemented based on specific diagram requirements
		window.debug.log(`Initialized diagram: ${element.id}`, 'info');
	}

	initializeAnimation(element) {
		// Initialize animation
		// This would be implemented based on specific animation requirements
		window.debug.log(`Initialized animation: ${element.id}`, 'info');
	}

	initializeWorkflow(element) {
		// Initialize interactive workflow
		// This would be implemented to make workflow steps clickable/interactive
		window.debug.log(`Initialized workflow: ${element.id}`, 'info');
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { LESSONS, LessonManager };
}

// Initialize lesson manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	window.lessonManager = new LessonManager();
});