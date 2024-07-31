# Configuration dictionary for ChatOpenAI model
chat_openai_kwargs = {
    "temperature": 0,  # Controls the randomness of the model's output (lower values for deterministic output)
    "max_tokens": 3000,  # Maximum number of tokens to generate
    "streaming": True,  # Enable streaming mode for real-time token generation
    "verbose": False,  # Disable verbose logging
}

# Configuration dictionary for LangChain chat model
langchain_chat_kwargs = {
    "streaming": True,  # Enable streaming mode for real-time token generation
    "verbose": False,  # Disable verbose logging
}

# Cache configuration settings
CACHE_TYPE = "SimpleCache"  # Type of cache to use (SimpleCache for in-memory caching)
CACHE_DEFAULT_TIMEOUT = 3000  # Default timeout for cache entries in seconds
