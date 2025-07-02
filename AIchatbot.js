// AIchatbot.js
class AIChatbot extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Encapsulate the component

        // Initialize properties (but don't get attributes yet)
        this.chatToggleButton = null;
        this.chatPopup = null;
        this.chatIconElement = null;
        this.closeIcon = null;
        this.copilotFrame = null;
        this.CopilotAgentUrl = null; // Will be set in connectedCallback

        this.isChatOpen = false;
        this.iframeLoaded = false;
    }

    // connectedCallback is called when the element is added to the document's DOM
    connectedCallback() {
        // Now get attributes from the custom element
        // Default chat icon SVG as a data URI
        const defaultSvgIcon = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 20h-3v4l-5.333-4h-7.667v-4h2v2h6.333l2.667 2v-2h3v-8.001h-2v-2h4v12.001zm-6-6h-9.667l-5.333 4v-4h-3v-14.001h18v14.001z"/></svg>';

        // Get the attribute, if it starts with '<svg', assume it's direct SVG, otherwise it's a URL
        const chatIconAttribute = this.getAttribute('chat-icon');
        const chatIconHtml = chatIconAttribute && chatIconAttribute.startsWith('<svg') ? chatIconAttribute : `<img src="${chatIconAttribute || 'data:image/svg+xml;base64,PHN2ZyBpZD0iQUktY2hhdEljb24iIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yNCAyMGgtM3Y0bC01LjMzMy00aC03LjY2N3YtNGgydjJmNi4zMzNMMi42NjcgMnYydjJ2LTJoM3YtOC4wMDFoLTJ2LTJoNHYxMi4wMDF6bS02LTZoLTkuNjY3bC01LjMzMyA0di00aC0zdi0xNC4wMDFoMTh2MTQuMDAxIi8+PC9zdmc+'} " alt="Chat Icon" />`;

        const chatTitle = this.getAttribute('chat-title') || 'Chatbot';
        const agentUrl = this.getAttribute('agent-url');

        if (!agentUrl) {
            console.error('AI-Chatbot: "agent-url" attribute is required.');
            return; // Stop execution if critical attribute is missing
        }
        this.CopilotAgentUrl = agentUrl; // Assign it here

        this.shadowRoot.innerHTML = `
            <style>
                .AI-popup-hidden {
                    display: none !important;
                }
                .AI-iframe-container {
                    position: fixed;
                    bottom: 70px; /* Adjust based on button size */
                    right: 20px;
                    width: 350px; /* Typical chatbot width */
                    height: 500px; /* Typical chatbot height */
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    overflow: hidden;
                    background-color: white;
                    display: flex;
                    flex-direction: column;
                }
                iframe {
                    border: none;
                    width: 100%;
                    height: 100%;
                }
                #AI-chatToggleButton {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: #ffcc00;
                    color: black;
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    z-index: 1001;
                }
                #AI-chatToggleButton:hover {
                    background-color: ##e6b800;
                }
                .AI-hidden {
                    display: none;
                }
                #AI-chatIcon, #AI-closeIcon {
                    width: 24px;
                    height: 24px;
                    fill: currentColor; /* For SVG */
                    stroke: currentColor; /* For SVG */
                }
                /* Use this to style direct SVGs */
                #AI-chatIcon-container svg {
                    width: 24px;
                    height: 24px;
                    fill: currentColor;
                    stroke: currentColor;
                }
                /* Also for direct SVGs if you put them directly without a container */
                #AI-chatToggleButton svg {
                    width: 24px;
                    height: 24px;
                    fill: currentColor;
                    stroke: currentColor;
                }
            </style>
            <div id="AI-chatPopup" class="AI-popup-hidden">
                <div class="AI-iframe-container">
                    <iframe id="AI-copilotFrame" title="${chatTitle}" allow="microphone; camera; autoplay; fullscreen"></iframe>
                </div>
            </div>
            <button id="AI-chatToggleButton">
                <span id="AI-chatIcon-container">${chatIconHtml}</span> <svg id="AI-closeIcon" class="AI-hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        // Get references to elements within the shadow DOM
        this.chatToggleButton = this.shadowRoot.getElementById('AI-chatToggleButton');
        this.chatPopup = this.shadowRoot.getElementById('AI-chatPopup');
        this.chatIconElement = this.shadowRoot.getElementById('AI-chatIcon-container');
        this.closeIcon = this.shadowRoot.getElementById('AI-closeIcon');
        this.copilotFrame = this.shadowRoot.getElementById('AI-copilotFrame');

        // Add event listener
        this.chatToggleButton.addEventListener('click', this.toggleChat.bind(this));
    }

    toggleChat() {
        this.isChatOpen = !this.isChatOpen;

        this.chatPopup.classList.toggle('AI-popup-hidden');

        // Toggle visibility of the icon container and the close icon
        this.chatIconElement.classList.toggle('AI-hidden');
        this.closeIcon.classList.toggle('AI-hidden');

        if (this.isChatOpen && !this.iframeLoaded) {
            this.copilotFrame.src = this.CopilotAgentUrl;
            this.iframeLoaded = true;
        }
    }
}

customElements.define('ai-chatbot', AIChatbot);
