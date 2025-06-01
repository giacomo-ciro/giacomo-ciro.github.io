from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from datetime import datetime
from dotenv import load_dotenv

from giacomino import Giacomino

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize Giacomino model
MODEL_PATH = "meta-llama/Llama-3.2-3B-Instruct-Turbo"
try:
    giacomino = Giacomino(model_text=MODEL_PATH)
    logger.info(f"Giacomino model initialized with {MODEL_PATH}")
except Exception as e:
    logger.error(f"Failed to initialize Giacomino: {e}")
    giacomino = None

@app.route('/')
def hello_world():
    """
    Returns the API documentation.
    """
    return {
        "message": "Giacomo Ciro's Personal Chatbot API",
        "version": giacomino.version if giacomino else "N/A",
        "endpoints": {
            "/chat": "POST - Chat with Giacomino",
            "/health": "GET - Check API health",
            "/docs": "GET - Get documentation about Giacomo"
        }
    }

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    """
    return jsonify({
        "status": "healthy" if giacomino else "unhealthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": giacomino is not None
    })

@app.route('/chat', methods=['POST'])
def chat():
    """
    Main chat endpoint for the personal chatbot.
    """
    if not giacomino:
        return jsonify({'error': 'Model not available'}), 503
    
    try:
        data = request.get_json()
        if not data or 'messages' not in data:
            return jsonify({'error': 'Missing message in request body'}), 400
        
        messages = data['messages']
        print(messages)
        if not messages:
            return jsonify({'error': 'Empty message'}), 400
        
        # Generate response using Giacomino
        response = giacomino.generate_response(messages)
        
        return jsonify({
            'text': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/docs', methods=['GET'])
def get_docs():
    """
    Returns information about Giacomo that the chatbot can use.
    """
    if not giacomino:
        return jsonify({'error': 'Model not available'}), 503
    
    try:
        docs = giacomino.get_available_docs()
        return jsonify({'documents': docs})
    except Exception as e:
        logger.error(f"Error retrieving docs: {e}")
        return jsonify({'error': 'Failed to retrieve documents'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)