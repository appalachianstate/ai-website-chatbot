// AIchatbot.js
class AIChatbot extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Encapsulate the component

        // Get attributes from the custom element
        const chatIconSrc = this.getAttribute('chat-icon') || 'data:image/svg+xml;base64,PHN2ZyBpZD0iQUktY2hhdEljb24iIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTI0IDIwaC0zdjRsLTUuMzMzLTRoLTcuNjY3di00aDJ2MmY2LjMzM2wyLjY2NyAydjJ2LTJoM3YtOC4wMDFoLTJ2LTJoNHYxMi4wMDF6bS02LTZoLTkuNjY3bC01LjMzMyA0di00aC0zdi0xNC4wMDFoMTh2MTQuMDAxIi8+PC9zdmc+'; // Default chat icon SVG
        const chatTitle = this.getAttribute('chat-title') || 'Chatbot';
        const agentUrl = this.getAttribute('agent-url');

        if (!agentUrl) {
            console.error('AI-Chatbot: "agent-url" attribute is required.');
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                /* Styles from AIchatbot.css, adapted for Shadow DOM */
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
                    background-color: #0078d4; /* Microsoft blue for example */
                    color: white;
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
                    background-color: #005bb5;
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
                .AI-header {
                    background-color: #f0f0f0;
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                    font-weight: bold;
                    text-align: center;
                }
            </style>
            <div id="AI-chatPopup" class="AI-popup-hidden">
                <div class="AI-header">${chatTitle}</div>
                <div class="AI-iframe-container">
                    <iframe id="AI-copilotFrame" title="${chatTitle}" allow="microphone; camera; autoplay; fullscreen"></iframe>
                </div>
            </div>
            <button id="AI-chatToggleButton">
                <img id="AI-chatIcon" src="${chatIconSrc}" alt="Chat Icon" />
                <svg id="AI-closeIcon" class="AI-hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        this.chatToggleButton = this.shadowRoot.getElementById('AI-chatToggleButton');
        this.chatPopup = this.shadowRoot.getElementById('AI-chatPopup');
        this.chatIcon = this.shadowRoot.getElementById('AI-chatIcon');
        this.closeIcon = this.shadowRoot.getElementById('AI-closeIcon');
        this.copilotFrame = this.shadowRoot.getElementById('AI-copilotFrame');

        this.CopilotAgentUrl = agentUrl;

        this.isChatOpen = false;
        this.iframeLoaded = false;

        this.chatToggleButton.addEventListener('click', this.toggleChat.bind(this));
    }

    toggleChat() {
        this.isChatOpen = !this.isChatOpen;

        this.chatPopup.classList.toggle('AI-popup-hidden');

        this.chatIcon.classList.toggle('AI-hidden');
        this.closeIcon.classList.toggle('AI-hidden');

        if (this.isChatOpen && !this.iframeLoaded) {
            this.copilotFrame.src = this.CopilotAgentUrl;
            this.iframeLoaded = true;
        }
    }
}

customElements.define('ai-chatbot', AIChatbot);
