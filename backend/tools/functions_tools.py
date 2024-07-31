import json
from datetime import datetime
from langchain.tools import Tool
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Use a non-interactive backend
import matplotlib.pyplot as plt
import io
import base64
from typing import List, Any, Dict
from pydantic import BaseModel
from functools import lru_cache
from langchain.tools import StructuredTool
from pydantic import BaseModel, Field
from typing import List, Union

# Set up the logger for this module
logger = logging.getLogger(__name__)

# Define the data model for chart data
class ChartData(BaseModel):
    type: str
    data: str

# Define the data model for table data
class TableData(BaseModel):
    headers: List[str]
    rows: List[List[Any]]

# Define the input model for chart generation
class ChartInput(BaseModel):
    columns: List[str]
    data: List[List[Any]]
    chart_type: str


@lru_cache(maxsize=1)
def get_columns_descriptions() -> str:
    """
    Get the descriptions of the columns in the table.
    Results are cached to avoid repeated executions.
    
    :return: JSON string of column descriptions.
    """
    from tools.tools_constants import COLUMNS_DESCRIPTIONS
    return json.dumps(COLUMNS_DESCRIPTIONS, ensure_ascii=False)


# Generate chart data from input
def generate_chart(input_data: Union[str, dict, ChartInput] = None, **kwargs):
    """
    Generate chart data from the provided input.
    
    :param input_data: Input data for the chart (JSON string, dictionary, or ChartInput object).
    :param kwargs: Additional keyword arguments.
    :return: Dictionary with processed data for chart generation.
    """
    try:
        if input_data is None and kwargs:
            # If input_data is not provided, use kwargs
            data = kwargs
        elif isinstance(input_data, str):
            # If input is a string, try to parse it as JSON
            data = json.loads(input_data)
        elif isinstance(input_data, dict):
            # If input is already a dictionary, use it directly
            data = input_data
        elif isinstance(input_data, ChartInput):
            # If input is a ChartInput object, convert it to a dict
            data = input_data.dict()
        else:
            raise ValueError("Invalid input type for generate_chart")

        # Ensure all required fields are present
        required_fields = ['columns', 'data', 'chart_type']
        if not all(field in data for field in required_fields):
            missing_fields = [field for field in required_fields if field not in data]
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

        columns = data['columns']
        chart_data = data['data']
        chart_type = data['chart_type']
        
        return {
            'columns': columns,
            'data': chart_data,
            'chart_type': chart_type
        }

    except Exception as e:
        logger.error(f"Error in generate_chart: {str(e)}", exc_info=True)
        return f"Error preparing chart data: {str(e)}"

# Define the SQL agent tools
def sql_agent_tools(db: Session):
    """
    Define and configure the tools for the SQL agent.
    
    :param db: SQLAlchemy session object.
    :return: List of configured tools.
    """
    tools = [
        Tool.from_function(
            func=lambda _: get_columns_descriptions(),
            name="get_columns_descriptions",
            description="Useful for getting the descriptions of columns in the table.",
        ),
        StructuredTool.from_function(
            func=generate_chart,
            name="generate_chart",
            description="Prepares data for chart generation. Input: JSON, dict, or args for columns, data, and chart_type. Returns: Dict with processed data for later chart creation.",
            args_schema=ChartInput
        ),
    ]
    return tools

# Create a chart image from the provided data
def create_chart_image(chart_data):
    """
    Create a chart image from the provided data.
    
    :param chart_data: Dictionary containing the chart data.
    :return: Base64-encoded string of the chart image or error message.
    """
    try:
        columns = chart_data['columns']
        data = chart_data['data']
        chart_type = chart_data['chart_type']

        # Create a DataFrame from the data
        df = pd.DataFrame(data, columns=columns)

        plt.figure(figsize=(10, 6))  # Increased figure size
        if chart_type == "bar":
            df.plot(kind="bar", x=columns[0], y=columns[1])
        elif chart_type == "line":
            df.plot(kind="line", x=columns[0], y=columns[1])
        elif chart_type == "pie":
            plt.pie(df[columns[1]], labels=df[columns[0]], autopct='%1.1f%%')
        elif chart_type == "scatter":
            plt.scatter(df[columns[0]], df[columns[1]])
        
        plt.title(f"{chart_type.capitalize()} Chart")
        plt.xlabel(columns[0])
        plt.ylabel(columns[1])
        
        buffer = io.BytesIO()
        plt.savefig(buffer, format="png", dpi=300)  # Increased DPI for better quality
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()  # Close the figure to free up memory

        return f"<img src='data:image/png;base64,{image_base64}' alt='{chart_type.capitalize()} Chart' />"
    except Exception as e:
        return f"Error creating chart: {str(e)}"
