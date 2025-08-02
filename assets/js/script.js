const BRANCH_NAME="main";
const PATH_TO_ROOT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 
  window.location.origin : `https://raw.githubusercontent.com/giacomo-ciro/giacomo-ciro.github.io/refs/heads/${BRANCH_NAME}`;
const GIACOMINO_API_URL= "https://brimax.pythonanywhere.com";
const PROJECTS_TO_EXCLUDE = ["230430", "230621"];
const PATH_TO_JSONS=`${PATH_TO_ROOT}/assets/jsons`;
const PATH_TO_TEMPLATES=`${PATH_TO_ROOT}/assets/templates`;


// ----------------------
//      [functions] 
// ----------------------

function includeHeader(){
  fetch(`${PATH_TO_TEMPLATES}/header.html`)
    .then(response => response.text())
    .then(data => {
        console.log(data);
        const header = document.getElementById('header');
        header.innerHTML = data;
        console.log(header)
        console.log('Header updated')
      }).catch(error => {
        console.error('Error including header:', error);
      });
};

function updateProjects(){
    fetch(`${PATH_TO_JSONS}/projects.json`)
      .then(response => response.json())
      .then(data => {
        delay = 0
        data['projects'].forEach(project => {
          const { title, date, tags, description, links, id } = project;
          
          // Skip unwanted projects
          if (PROJECTS_TO_EXCLUDE.includes(id)) {
            return;
          }
          // Function to find the correct thumbnail extension
          const getThumbnailUrl = (projectId) => {
            const extensions = ['png', 'jpg', 'jpeg'];
            // We'll try each extension - the browser will handle 404s gracefully
            return `assets/img/thumbnails/${projectId}.png`; // Default to png, fallback handled in HTML
          };
          
          const thumbnailUrl = getThumbnailUrl(id);
          
          // Initialize projectHTML with the new layout including thumbnail
          var projectHTML = `
  <div class="project col-xl-5 col-12 d-flex justify-content-center" data-aos="fade-in" data-aos-delay="${delay}">
    <div class="project-card d-flex">
      <div class="project-content d-flex flex-column justify-content-start">
        <div class="d-flex flex-row align-items-center justify-content-between mb-2">
          <h1 class="project-title">${title}</h1>
          <h3 class="project-date">${date}</h3>
        </div>
        <h2 class="project-tags">${tags}</h2>
        <p class="project-description">${description}</p>
        <div class="project-links d-flex flex-row justify-content-center align-items-center">
          `;
          delay += 25
          
          // Loop through the links dictionary and add the corresponding tags with links
          for (const [key, value] of Object.entries(links)) {
            if (value) {
              projectHTML += `<a href="${value}" target="_blank" class="project-link">${key.charAt(0).toUpperCase() + key.slice(1)}</a>`;
            }
          }
  
          // Add thumbnail and close the projectHTML structure
          projectHTML += `
                  </div>
                </div>
                <div class="project-thumbnail">
                  <img src="${thumbnailUrl}" 
                       alt="Thumbnail for ${title}" 
                       class="thumbnail-img"
                       onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                       onload="this.style.display='block'; this.nextElementSibling.style.display='none';">
                  <div class="thumbnail-placeholder" style="display: none;">
                    <span>No thumbnail available for project id ${id}</span>
                  </div>
                </div>
              </div>
            </div>
          `;
  
          // Append the projectHTML to the project list
          document.getElementById('project-container-row').innerHTML += projectHTML;
        });
        
        // After all projects are loaded, try alternative extensions for failed images
        setTimeout(() => {
          document.querySelectorAll('.thumbnail-img').forEach(img => {
            if (img.style.display === 'none' || img.complete === false) {
              const originalSrc = img.src;
              const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
              const extensions = ['jpg', 'jpeg', 'png'];
              
              let extensionIndex = 0;
              const tryNextExtension = () => {
                if (extensionIndex < extensions.length) {
                  const newSrc = `${basePath}.${extensions[extensionIndex]}`;
                  img.onload = () => {
                    img.style.display = 'block';
                    img.nextElementSibling.style.display = 'none';
                  };
                  img.onerror = () => {
                    extensionIndex++;
                    tryNextExtension();
                  };
                  img.src = newSrc;
                } else {
                  // All extensions failed, show placeholder
                  img.style.display = 'none';
                  img.nextElementSibling.style.display = 'block';
                }
              };
              
              tryNextExtension();
            }
          });
        }, 100);
        
        console.log('Project list updated')
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

function includeFooter() {
  fetch(`${PATH_TO_TEMPLATES}/footer.html`)
      .then(response => response.text())
      .then(data => {
          document.getElementById('footer').innerHTML = data;
          console.log('Footer updated')
      });
};

function updateTimeline(){
  delay = 0
  fetch(`${PATH_TO_JSON}/timeline.json`)
    .then(response => response.json())
    .then(data => {
      const chronologicalEvents = data['timeline'];
      chronologicalEvents.forEach(project => {
        const { date, event, strong } = project;
        // Assign class based on 'strong'
        const eventClass = strong ? 'strong' : 'weak';
        var projectHTML = `
          <div class="timeline-event ${eventClass} d-flex flex-row align-items-center" data-aos="fade-in" data-aos-delay="${delay}">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                  <div class="timeline-date">${date}</div>
                  <div class="timeline-title">${event}</div>
              </div>
          </div>
        `;
        document.getElementById('timeline-container').innerHTML += projectHTML;
        delay += 0
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
  
  fetch(`${PATH_TO_JSON}/quotes.json`)
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
  fetch(`${PATH_TO_TEMPLATES}/chatbot.html`)
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

  // Render the version and model info
  // Fetch and render chatbot version and model info
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
        const modelName = data.models.model_text.split('/').pop().replace(/-/g, ' ');
        modelText.textContent = `Powered by: ${modelName}`;
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

function showLoader() {
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  document.body.appendChild(preloader);
}

function hideLoader() {
  const loaderDiv = document.getElementById('preloader');
  if (loaderDiv) {
    loaderDiv.remove();
  }
}

// Scroll animation (shadow) on header
function toggleScrolled() {
  const selectBody = document.querySelector('body');
  const selectHeader = document.querySelector('#header');
  if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
  window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
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

// ------ [functions end] -------


// -----------------------
//    call everything
// -----------------------

// Show loader immediately when script loads
showLoader();

// Update title for all
document.querySelector('head').getElementsByTagName('title')[0].innerHTML = 'Giacomo Cirò | MSc in Artificial Intelligence'

window.onload = function() {

  includeHeader();

  // Dynamic updates based on page
  var path = window.location.pathname;
  if (path.includes('projects.html')) {
      updateProjects();
  } else if (path.includes('timeline.html')){
      updateTimeline();
  } else if (path.includes('quotes.html')) {
      updateQuotes();
  }

  includeFooter();

  includeChatbot();

  aosInit()

  hideLoader();
};


document.addEventListener('scroll', toggleScrolled);
window.addEventListener('load', toggleScrolled);