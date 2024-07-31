import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# LLM (Language Model) Configuration
TOOL_LLM_NAME = os.getenv("TOOL_LLM_NAME")  # Name of the tool language model
AGENT_LLM_NAME = os.getenv("AGENT_LLM_NAME")  # Name of the agent language model

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # API key for accessing OpenAI services
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # API key for accessing Google services

# Database Configuration
DB_PATH = os.getenv("DB_PATH")  # Path to the database

# Other Configuration
MAX_RETRIES = 2  # Maximum number of retries for certain operations
TIMEOUT = 60  # Timeout duration in seconds
