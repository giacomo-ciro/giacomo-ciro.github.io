const GIACOMINO_API_URL= "https://brimax.pythonanywhere.com";

function initializeChatbot() {
  fetch(`${GIACOMINO_API_URL}/status`)
    .then(response => response.json())
    .then(data => {
      // Update version in title
      const title = document.getElementById('chatbot-title');
      if (title && data.version) {
        title.textContent += ` (v${data.version})`;
      }
      // Update model info
      const modelInfo = document.getElementById('chatbot-model-info');
      const modelText = document.getElementById('chatbot-model-text');
      if (modelInfo && modelText && data.models && data.models.model_text) {
        console.log(data.models.model_text);
        const modelSlug = data.models.model_text.split('/').pop();
        const modelName = modelSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const modelUrl = `https://www.together.ai/models/${modelSlug.toLowerCase()}`;
        modelText.innerHTML = `Powered by: <a href="${modelUrl}" target="_blank" rel="noopener">${modelName}</a>`;
        modelInfo.style.display = 'flex';
      }
    })
    .catch(error => {
      console.error('Failed to fetch chatbot version/model:', error);
    });


  // Chatbot Class Definition
  class Chatbot {
    constructor() {
      this.isOpen = false;
      this.isLoading = false;
      this.apiUrl = `${GIACOMINO_API_URL}/chat`;
      this.history = [];
      this.bindEvents();
      
      // Add initial bot message to history
      this.history.push({ 
        role: 'assistant', 
        content: "Ciao! I'm Giacomino, ask me anything about Giacomo—I'll help if I can!" 
      });
    }
    
    bindEvents() {
      const button = document.getElementById('chatbot-button');
      const closeBtn = document.getElementById('chatbot-close');
      const sendBtn = document.getElementById('chatbot-send');
      const input = document.getElementById('chatbot-input');

      if (button) button.addEventListener('click', () => this.toggleChat());
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeChat());
      if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
      
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
          }
        });
      }
    }

    toggleChat() {
      const window = document.getElementById('chatbot-window');
      if (!window) return;

      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      const window = document.getElementById('chatbot-window');
      if (!window) return;

      window.classList.add('show');
      this.isOpen = true;
      
      // Focus on input
      setTimeout(() => {
        const input = document.getElementById('chatbot-input');
        if (input) input.focus();
      }, 300);
    }

    closeChat() {
      const window = document.getElementById('chatbot-window');
      if (!window) return;

      window.classList.remove('show');
      this.isOpen = false;
    }

    async sendMessage() {
      const input = document.getElementById('chatbot-input');
      const sendBtn = document.getElementById('chatbot-send');

      if (!input || this.isLoading) return;

      const message = input.value.trim();
      if (!message) return;

      // Add user message to UI and history FIRST
      this.addMessage(message, 'user');
      
      // Clear input immediately
      input.value = '';
      if (sendBtn) sendBtn.disabled = true;

      this.showLoading(true);
      this.isLoading = true;

      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: this.history })
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        const botResponse = data.text || data.message || data.response || 'Sorry, I couldn\'t process your request.';
        this.addMessage(botResponse, 'assistant');

      } catch (error) {
        console.error('Chatbot API error:', error);
        this.addMessage('Sorry, I\'m having trouble connecting. Please try again later.', 'assistant');
      } finally {
        this.showLoading(false);
        this.isLoading = false;
        if (sendBtn) sendBtn.disabled = false;
        if (input) input.focus();
      }
    }

    addMessage(content, type) {
      const messagesContainer = document.getElementById('chatbot-messages');
      if (!messagesContainer) {
        console.error('Messages container not found');
        return;
      }

      // Create message element
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}-message`;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.textContent = content;

      messageDiv.appendChild(contentDiv);
      messagesContainer.appendChild(messageDiv);

      // Add to history with correct role mapping
      const role = type === 'user' ? 'user' : 'assistant';
      this.history.push({ role: role, content: content });

      // Scroll to bottom with a small delay to ensure DOM is updated
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 10);
    }

    showLoading(show) {
      const loading = document.getElementById('chatbot-loading');
      if (!loading) return;

      if (show) {
        loading.classList.add('show');
      } else {
        loading.classList.remove('show');
      }
    }
  }

  // Initialize chatbot instance
  window.chatbotInstance = new Chatbot();
  console.log('Chatbot initialized successfully');
}


// Hamburger menu dropdown
function initNavToggle() {
  const toggle = document.getElementById('menu-toggle');
  const dropdown = document.getElementById('nav-dropdown');
  if (!toggle || !dropdown) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
      dropdown.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Animate on scroll library
function aosInit() {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
}

// Load everything
function initAll() {
  initializeChatbot();
  aosInit();
  initNavToggle();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}