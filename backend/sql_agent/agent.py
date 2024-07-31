from langchain_openai.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.agents.agent_types import AgentType
from langchain_community.agent_toolkits import create_sql_agent, SQLDatabaseToolkit
from langchain_community.callbacks.manager import get_openai_callback
from typing import List, Any
import logging
import json
import re
from tools.functions_tools import create_chart_image
#from tools.retriever import get_retriever_tool
from utils import get_chat_openai, get_chat_gemini
from tools.functions_tools import sql_agent_tools
from database.sql_db_langchain import db
from .agent_constants import CUSTOM_SUFFIX

# Set up the logger for this module
logger = logging.getLogger(__name__)

def get_sql_toolkit(tool_llm_name: str):
    """
    Retrieve the SQL toolkit for the specified tool LLM name.
    
    :param tool_llm_name: Name of the tool LLM.
    :return: Configured SQLDatabaseToolkit instance.
    """
    if tool_llm_name == "gpt-4o":
        llm_tool = get_chat_openai(model_name=tool_llm_name)
    elif tool_llm_name == "gemini-pro":
        llm_tool = get_chat_gemini(model_name=tool_llm_name)
    else:
        raise ValueError(f"Unsupported tool LLM: {tool_llm_name}")
    
    return SQLDatabaseToolkit(db=db, llm=llm_tool)

def get_agent_llm(agent_llm_name: str):
    """
    Retrieve the agent LLM for the specified agent LLM name.
    
    :param agent_llm_name: Name of the agent LLM.
    :return: Configured agent LLM instance.
    """
    if agent_llm_name == "gpt-4o":
        return get_chat_openai(model_name=agent_llm_name)
    elif agent_llm_name == "gemini-pro":
        return get_chat_gemini(model_name=agent_llm_name)
    else:
        raise ValueError(f"Unsupported agent LLM: {agent_llm_name}")

def create_retail_agent(
    tool_llm_name: str = "gpt-4o",
    agent_llm_name: str = "gpt-4o",
    db_session: Any = None
):
    """
    Create a retail agent with specified tool and agent LLM names and a database session.
    
    :param tool_llm_name: Name of the tool LLM.
    :param agent_llm_name: Name of the agent LLM.
    :param db_session: Database session.
    :return: Configured retail agent instance.
    """
    agent_tools = sql_agent_tools(db_session)  # Get the SQL agent tools
    #retriever_tools = get_retriever_tool() # This too will be used later after manually testing all the pre-defined SQL query on the dataset.
    llm_agent = get_agent_llm(agent_llm_name)  # Get the agent LLM
    toolkit = get_sql_toolkit(tool_llm_name)  # Get the SQL toolkit
    memory = ConversationBufferMemory(memory_key="history", input_key="input")  # Create conversation memory

    return create_sql_agent(
        llm=llm_agent,
        toolkit=toolkit,
        agent_type=AgentType.OPENAI_FUNCTIONS,
        input_variables=["input", "agent_scratchpad", "history"],
        suffix=CUSTOM_SUFFIX,
        agent_executor_kwargs={"memory": memory, "handle_parsing_errors": True},
        extra_tools=agent_tools,
        # extra_tools=agent_tools + [retriever_tools],
        verbose=True,
    )

def run_agent(agent, input_text: str, chat_history: list):
    """
    Run the agent with the given input text and chat history.
    Processes the response to detect and handle chart data.
    
    :param agent: The agent instance.
    :param input_text: Input text for the agent.
    :param chat_history: List of chat history messages.
    :return: Tuple containing the output, total tokens used, and total cost.
    """
    with get_openai_callback() as cb:
        response = agent.invoke(input=input_text, chat_history=chat_history)
    
    output = response['output']
    
    # Check if the response contains chart data
    if isinstance(output, str) and "Chart data:" in output:
        logger.info("Chart data detected in response")
        
        try:
            # Use regex to extract the JSON string
            match = re.search(r'Chart data:\s*```json\s*(\{.*?\})\s*```', output, re.DOTALL)
            if match:
                chart_data_str = match.group(1)
                chart_data = json.loads(chart_data_str)
                
                # Generate the chart
                chart_image = create_chart_image(chart_data)
                
                if chart_image.startswith("Error"):
                    logger.error(f"Error in create_chart_image: {chart_image}")
                    # Provide a fallback message
                    chart_replacement = "Sorry, there was an error generating the chart. Here's the data instead:\n\n" + chart_data_str
                else:
                    chart_replacement = "Here's the generated chart:\n\n" + chart_image
                
                # Replace the chart data in the response
                output = re.sub(r'Chart data:\s*```json\s*\{.*?\}\s*```', chart_replacement, output, flags=re.DOTALL)
                logger.info("Chart processing completed")
            else:
                logger.error("Could not find JSON data in the expected format")
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON: {str(e)}")
        except Exception as e:
            logger.error(f"Error in chart processing: {str(e)}")
    else:
        logger.info("No chart data detected in response")

    return output, cb.total_tokens, cb.total_cost
