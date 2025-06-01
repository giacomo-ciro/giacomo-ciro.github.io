// All variables
document.querySelector('head').getElementsByTagName('title')[0].innerHTML = 'Giacomo Cirò | MSc in Artificial Intelligence'

function updateProjects(){
    fetch("https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/main/assets/projects.json")
      .then(response => response.json())
      .then(data => {
        delay = 0
        data['projects'].forEach(project => {
          const { title, date, tags, description, links } = project;
          // Initialize projectHTML with the common elements
          var projectHTML = `
            <div class="project col-md-3 col-sm-5 col-12" data-aos="fade-in" data-aos-delay="${delay}">
              <div class="d-flex flex-row align-item-center justify-content-between">
                <h1>${title}</h1>
                <h3>${date}</h3>
              </div>
                <h2>${tags}</h2>
                <p>${description}</p>
                <div class="d-flex flex-row justify-content-center align-items-center">
          `;
          delay += 25
          // Loop through the links dictionary and add the corresponding tags with links
          for (const [key, value] of Object.entries(links)) {
            if (value) {
              projectHTML += `<a href="${value}" target="_blank">${key.charAt(0).toUpperCase() + key.slice(1)}</a>`;
            }
          }
  
          // Close the projectHTML structure
          projectHTML += `
                </div>
            </div>
          `;
  
          // Append the projectHTML to the project list
          document.getElementById('project-container-row').innerHTML += projectHTML;
        });
        console.log('Project list updated')
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

function includeFooter() {
  fetch("https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/main/footer.html")
      .then(response => response.text())
      .then(data => {
          document.getElementById('footer').innerHTML = data;
          console.log('Footer updated')
      });
};

function updateTimeline(){
  delay = 0
  fetch("https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/main/assets/timeline.json")
    .then(response => response.json())
    .then(data => {
      const chronologicalEvents = data['timeline'];
      chronologicalEvents.forEach(project => {
        const { date, event } = project;
        
        // Initialize projectHTML with the common elements
        var projectHTML = `
                  <div class="timeline-event d-flex flex-row align-items-center" data-aos="fade-in" data-aos-delay="${delay}">
                      <div class="timeline-dot"></div>
                      <div class="timeline-content">
                          <div class="timeline-date">${date}</div>
                          <div class="timeline-title">${event}</div>
                      </div>
                  </div>
        `;
        // Append the projectHTML to the project list
        document.getElementById('timeline-container').innerHTML += projectHTML;

        delay += 50
      });
      console.log('Timeline updated')
      })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

};

function updateQuotes() {
  let delay = 0;
  const quotesContainer = document.getElementById('quotes-container-row');
  
  if (!quotesContainer) return;
  
  // Clear existing quotes
  quotesContainer.innerHTML = '';
  
  fetch("https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/main/assets/quotes.json")
    .then(response => response.json())
    .then(data => {
      // If no quotes, show message
      if (!data.quotes || data.quotes.length === 0) {
        quotesContainer.innerHTML = '<div class="no-quotes">No quotes found. Add some to your quotes.json file!</div>';
        return;
      }
      
      // Randomize quotes array using Fisher-Yates (Knuth) shuffle algorithm
      const quotes = [...data.quotes]; // Create a copy of the quotes array
      for (let i = quotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotes[i], quotes[j]] = [quotes[j], quotes[i]]; // Swap elements
      }
      
      // Render randomized quotes
      quotes.forEach(quote => {
        const { text, author, source, year } = quote;
        let quoteHTML = `
          <div class="quote-card col-md-3 col-sm-5 col-12" data-aos="fade-up" data-aos-delay="${delay}">
            <p class="quote-content">${text}</p>
            <p class="quote-author">${author || 'Unknown'}</p>
        `;
        
        // Add source info if available
        if (source || year) {
          quoteHTML += `<p class="quote-source">${source || ''}${source && year ? ', ' : ''}${year || ''}</p>`;
        }
        
        quoteHTML += `</div>`;
        
        // Append quote to container
        quotesContainer.innerHTML += quoteHTML;
        
        delay += 0;
      });
      
      console.log('Quotes updated and randomized');
    })
    .catch(error => {
      console.error('Error fetching quotes:', error);
      // Hide loading indicator and show error message
      if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
      }
      quotesContainer.innerHTML = '<div class="no-quotes">Failed to load quotes. Please try again later.</div>';
    });
}

// Chatbot Integration
function includeChatbot() {
  fetch("https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/main/chatbot.html")
      .then(response => response.text())
      .then(data => {
          // Create a container and insert the chatbot HTML
          const chatbotContainer = document.createElement('div');
          chatbotContainer.innerHTML = data;
          document.body.appendChild(chatbotContainer);
          
          // Initialize chatbot functionality after HTML is inserted
          initializeChatbot();
      })
      .catch(error => {
          console.error('Error loading chatbot:', error);
      });
}

// Chatbot Functionality - FIXED VERSION
function initializeChatbot() {
  // Chatbot Class Definition
  class Chatbot {
    constructor() {
      this.isOpen = false;
      this.isLoading = false;
      this.apiUrl = 'https://brimax.pythonanywhere.com/chat';
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


//------------------------------------------- call everything
window.onload = function() {
  // if on the project page, update projects
  var path = window.location.pathname;
  if (path.includes('projects.html')) {
      updateProjects();
  } else if (path.includes('timeline.html')){
      updateTimeline();
  } else if (path.includes('quotes.html')) {
      updateQuotes();
  }
  // always update footer
  includeFooter();

  // add chatbot
  includeChatbot();

  // init aos
  aosInit()
};

function toggleScrolled() {
  const selectBody = document.querySelector('body');
  const selectHeader = document.querySelector('#header');
  if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
  window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
}

document.addEventListener('scroll', toggleScrolled);
window.addEventListener('load', toggleScrolled);

function aosInit() {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
}
