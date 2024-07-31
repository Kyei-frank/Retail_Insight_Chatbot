from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain.tools import Tool
from .tools_constants import retriever_tool_description, few_shots_examples

def get_retriever_tool():
    """
    Create and configure a retriever tool for few-shot learning examples.
    
    :return: Configured Tool instance for retrieving few-shot examples.
    """
    # Initialize OpenAI embeddings
    embeddings = OpenAIEmbeddings()

    # Create Document instances for few-shot examples
    few_shot_docs = [
        Document(
            page_content=question, metadata={"sql_query": few_shots_examples[question]}
        )
        for question in few_shots_examples.keys()
    ]

    # Create a FAISS vector store from the documents and embeddings
    vector_db = FAISS.from_documents(few_shot_docs, embeddings)

    # Create a retriever from the vector store
    retriever = vector_db.as_retriever()

    def retriever_func(query: str) -> str:
        """
        Retrieve the most relevant few-shot example for the given query.
        
        :param query: The query string.
        :return: The page content of the most relevant example, or a default message if none found.
        """
        results = retriever.get_relevant_documents(query)
        return results[0].page_content if results else "No relevant examples found."

    # Create and return the Tool instance
    return Tool(
        name="sql_get_few_shot",
        description=retriever_tool_description,
        func=retriever_func
    )
