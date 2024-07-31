from langchain_community.utilities import SQLDatabase
from sqlalchemy import create_engine
import pandas as pd
from sqlalchemy.orm import sessionmaker
from functools import lru_cache

# Caching the database engine to ensure only one instance is created
@lru_cache(maxsize=1)
def get_engine():
    """
    Get the database engine instance with caching.
    Uses LRU cache to store one instance of the engine.
    
    :return: SQLAlchemy engine connected to the SQLite database.
    """
    return create_engine("sqlite:///retail_data.db")

def init_db():
    """
    Initialize the database with data from a CSV file.
    Converts and cleans the data before storing it in the database.
    """
    # Read data from CSV file
    df = pd.read_csv("Noodify-AI/backend/database/retail_data.csv")
    
    # Convert 'Period' column to datetime format
    df["Period"] = pd.to_datetime(df["Period"], format="%b-%y")
    
    # Convert 'Unit_Price' column to float, removing commas
    df["Unit_Price"] = df["Unit_Price"].str.replace(",", "").astype(float)
    
    # Convert 'Sales_Volume(KG_LTRS)' column to float, removing commas
    df["Sales_Volume(KG_LTRS)"] = df["Sales_Volume(KG_LTRS)"].str.replace(",", "").astype(float)
    
    # Convert 'Sales_Value' column to float, removing commas
    df["Sales_Value"] = df["Sales_Value"].str.replace(",", "").astype(float)
    
    # Get the database engine
    engine = get_engine()
    
    # Write the DataFrame to the SQL database
    df.to_sql("retail_data", engine, index=False, if_exists="replace")

# Create an instance of SQLDatabase with the cached engine
db = SQLDatabase(engine=get_engine())

# Configure sessionmaker with the engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())

def get_db():
    """
    Get a new database session.
    Ensures the session is closed after use.
    
    :yield: Database session instance.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the database
init_db()
