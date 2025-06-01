import os
import shutil
import logging
from typing import List, Dict, Any
from together import Together
import chromadb
from chromadb.utils import embedding_functions
from pathlib import Path

logger = logging.getLogger(__name__)

class Giacomino:
    """
    Personal chatbot for Giacomo Cirò's website.
    Handles retrieval-augmented generation for questions about Giacomo.
    """

    def __init__(
        self,
        model_text="meta-llama/Llama-3.2-3B-Instruct-Turbo",
        model_embeddings="BAAI/bge-base-en-v1.5",
    ):
        self.version = "1.0.0"
        
        # Initialize Together AI client
        self.together_api_key = os.getenv('TOGETHER_API_KEY')
        if not self.together_api_key:
            raise ValueError("TOGETHER_API_KEY environment variable not set")
        
        self.together = Together(api_key=self.together_api_key)
        self.model_text = model_text
        self.model_embeddings = model_embeddings
        
        # Initialize ChromaDB for vector storage
        shutil.rmtree("./chroma_db")
        self.chroma_client = chromadb.PersistentClient(path="./chroma_db")
        self.collection_name = "giacomo_knowledge"
        
        # Load prompts
        self._load_prompts()
        
        # Initialize knowledge base
        self._init_knowledge_base()
        
    def _load_prompts(self):
        """Load prompt templates from files or define defaults."""
        path_to_sys = Path("./system.txt")
        assert path_to_sys.exists()
        with open(path_to_sys, "r") as f:
            self.system_prompt = f.read()
        logger.info("Loaded system prompt")
        
    def _init_knowledge_base(self):
        """Initialize the vector database with documents about Giacomo."""
        # Delete the old collection if it exists
        try:
            self.chroma_client.delete_collection(self.collection_name)
            logger.info("Deleted existing knowledge base collection")
        except Exception as e:
            logger.info(f"No existing collection to delete: {e}")

        # Create a new collection
        ef = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="paraphrase-albert-small-v2"         # smallest model 40MB
        )
        self.collection = self.chroma_client.create_collection(
            name=self.collection_name,
            metadata={"description": "Knowledge about Giacomo Cirò"},
            embedding_function=ef
        )
        logger.info("Created new knowledge base collection")

        # Load documents
        self._load_documents()

    def _load_documents(self):
        """Load documents about Giacomo into the vector database."""
        
        # Init empty list of docs
        documents = []
        
        # Load from external file
        docs_file = Path("documents.txt")
        assert docs_file.exists()
        with open(docs_file, "r", encoding="utf-8") as f:
            file_docs = [line.strip() for line in f.readlines() if line.strip()]
            documents.extend(file_docs)
        
        # Add documents to collection
        assert documents
        ids = [f"doc_{i}" for i in range(len(documents))]
        self.collection.add(
            documents=documents,
            ids=ids,
            metadatas=[{"source": "knowledge_base"} for _ in documents]
        )
        logger.info(f"Loaded {len(documents)} documents into knowledge base")

    def retrieve_context(self, query: str, k: int = 3) -> List[str]:
        """Retrieve relevant documents for the query."""

        results = self.collection.query(
            query_texts=[query],
            n_results=k
        )
        
        return results['documents'][0]

    def _send_chat_completion_request(
        self, system_prompt, messages
    ) -> str:
        """Send request to Together AI chat completion API."""
        
        # Check
        for mex in messages:
            assert mex["role"] in {"system", "assistant", "user"}

        # Extend chat history
        messages = [
            {"role": "system", "content": system_prompt},
        ] + messages

        # Get model response
        response = self.together.chat.completions.create(
            model=self.model_text,
            messages=messages,
            max_tokens=512,
            temperature=0.7,
            top_p=0.9,
            stream=False,
        )

        return response.choices[0].message.content.strip()

    def generate_response(self, messages: list) -> str:
        """Generate a response to the user's message using RAG."""
        assert isinstance(messages, list)
        assert messages

        # Retrieve relevant context
        assert messages[-1]["role"]=="user"
        user_message = messages[-1]["content"]
        context_docs = self.retrieve_context(user_message, k=3)
        context = "\n".join(context_docs) if context_docs else "No specific context available."
        
        # Generate response
        system_prompt = self.system_prompt.format(context=context)
        response = self._send_chat_completion_request(system_prompt, messages)
        
        return response

    def get_available_docs(self) -> List[Dict[str, Any]]:
        """Get information about available documents in the knowledge base."""
        try:
            count = self.collection.count()
            return {
                "total_documents": count,
                "collection_name": self.collection_name,
                "status": "available" if count > 0 else "empty"
            }
        except Exception as e:
            logger.error(f"Error getting docs info: {e}")
            return {"total_documents": 0, "status": "error"}