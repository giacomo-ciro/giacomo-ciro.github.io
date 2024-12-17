const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const modelVersion = document.getElementById('model-version');
const influencerCount = document.getElementById('influencer-count');
let botTypingMessage = null; // Holds the temporary typing message

const updateModelInfo = async () => {
 
  try {
    const response = await fetch('https://brimax.pythonanywhere.com/model_version', {
      method: 'GET',
    });
    const data = await response.json();
    modelVersion.innerHTML += data.response;
  } catch (error) {
    modelVersion.innerHTML += "na";
  }

  try {
    const response = await fetch('https://brimax.pythonanywhere.com/influencer_count', {
      method: 'GET',
    });
    const data = await response.json();
    influencerCount.innerHTML += data.response;
  } catch (error) {
    influencerCount.innerHTML += "na";
  }
}

const appendMessage = (message, type) => {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('chat-message', type === 'user' ? 'user-message' : 'bot-message');
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // scroll to the bottom by setting the scrollTop (offset to top) to the scrollHeight
};

const showBotTyping = () => {   // same as = function() {
  botTypingMessage = document.createElement('div');
  botTypingMessage.classList.add('chat-message', 'bot-typing');
  botTypingMessage.textContent = 'Finding the right influencer for you...';
  chatBox.appendChild(botTypingMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const removeBotTyping = () => {
  if (botTypingMessage) {
    botTypingMessage.remove();
    botTypingMessage = null;
  }
};

const sendMessage = async () => {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  userInput.value = '';
  setTimeout(showBotTyping, 500); // Show bot is typing

  try {
    const response = await fetch('https://brimax.pythonanywhere.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "prompt": message })
    });
    const data = await response.json();
    removeBotTyping(); // Remove bot typing message
    appendMessage(data.response || 'Sorry, I couldn\'t process that.', 'bot');
  } catch (error) {
    removeBotTyping();
    appendMessage('Error contacting server. Please try again later.', 'bot');
  }
};

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

window.addEventListener('load', updateModelInfo);