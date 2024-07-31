from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from langserve.pydantic_v1 import BaseModel, Field
import asyncio
from typing import Any, List
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import logging

from sql_agent.agent import create_retail_agent, run_agent
from database.sql_db_langchain import get_db
from config import TOOL_LLM_NAME, AGENT_LLM_NAME
from utils import setup_logging

# Setup logging configuration
setup_logging()
logger = logging.getLogger("retail_insights")

# Define input data model for the API
class Input(BaseModel):
    input: str = Field(..., description="The retail insights query")
    tool_llm_name: str = Field(default=TOOL_LLM_NAME, description="LLM for SQL tools")
    agent_llm_name: str = Field(default=AGENT_LLM_NAME, description="LLM for the agent")
    chat_history: List[str] = Field(default=[], description="Chat history")

# Define output data model for the API
class Output(BaseModel):
    output: Any = Field(..., description="The response from the Retail Insights Chatbot")
    tokens_used: int = Field(..., description="Number of tokens used in the query")
    cost: float = Field(..., description="Cost of the query")

# Context manager to handle application lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Application is starting up...")
    yield
    # Shutdown
    logger.info("Application is shutting down...")

# Create FastAPI application instance
app = FastAPI(
    title="Retail Insights Chatbot",
    version="1.0",
    description="API for a Retail Insights Chatbot using LangChain's SQL agent",
    lifespan=lifespan
)

# CORS configuration to allow specific origins
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to truncate chat history to fit within token limit
def truncate_chat_history(history, max_tokens=1000):
    truncated_history = []
    current_tokens = 0
    for message in reversed(history):
        message_tokens = len(message.split())  # Simple approximation
        if current_tokens + message_tokens > max_tokens:
            break
        truncated_history.insert(0, message)
        current_tokens += message_tokens
    return truncated_history

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Retail Insights Chatbot API"}

# Endpoint to process retail insights queries
@app.post("/query", response_model=Output)
async def query_retail_insights(
    request: Request,
    input: Input,
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Received query: {input.input}")
        logger.info(f"Chat history: {input.chat_history}")

        # Truncate chat history to manage token usage
        truncated_history = truncate_chat_history(input.chat_history)
        
        # Create retail agent
        agent = create_retail_agent(input.tool_llm_name, input.agent_llm_name, db)
        
        # Run the agent asynchronously
        response, tokens, cost = await asyncio.to_thread(
            run_agent, agent, input.input, truncated_history
        )

        # Return the response
        return {"output": response, "tokens_used": tokens, "cost": cost}
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
