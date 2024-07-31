import uvicorn

# Entry point for running the FastAPI application
if __name__ == "__main__":
    # Run the application using Uvicorn server
    uvicorn.run(
        "main:app",  # Path to the ASGI application
        host="0.0.0.0",  # Host address to bind the server
        port=8000,  # Port number to listen on
        workers=4,  # Number of worker processes for handling requests
        reload=True  # Enable auto-reload for development (reload on code changes)
    )
