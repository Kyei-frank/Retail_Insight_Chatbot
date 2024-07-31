import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([]); // State to keep track of messages
  const [input, setInput] = useState(''); // State to keep track of the current input value
  const [isLoading, setIsLoading] = useState(false); // State to track if a request is in progress
  const messagesEndRef = useRef(null); // Reference to the end of the messages container
  const userAvatar = "https://placehold.co/30x30/blue/white?text=U"; // User avatar URL
  const botAvatar = "https://placehold.co/30x30/green/white?text=AI"; // Bot avatar URL

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
    console.log("Messages updated:", messages);
  }, [messages]);

  // Effect to log when the component mounts
  useEffect(() => {
    console.log("Chatbot component mounted");
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent empty submissions
    const newMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]); // Add the new user message to state
    setInput(''); // Clear the input field
    setIsLoading(true); // Set loading state to true
    console.log("Sending request to backend...");

    // Prepare chat history for the backend request
    const chat_history = messages.map(msg => `${msg.sender}: ${msg.text}`);
    
    const requestBody = {
      input: input,
      tool_llm_name: "gpt-4o",
      agent_llm_name: "gpt-4o",
      chat_history: chat_history
    };
    console.log("Sending request with body:", JSON.stringify(requestBody));
    
    try {
      // Send request to the backend
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      console.log("Response received:", response);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log("Data received:", data);
      
      // Extract only the output from the response
      const botOutput = typeof data.output === 'object' ? data.output.output : data.output;
      const botReply = { text: botOutput, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botReply]); // Add the bot's response to state
    } catch (error) {
      console.error('Error details:', error);
      setMessages(prevMessages => [...prevMessages, { text: "An error occurred. Please try again later.", sender: 'bot' }]); // Handle error response
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  // Function to convert markdown table to HTML
  const convertMarkdownTableToHtml = (markdownTable) => {
    const rows = markdownTable.trim().split('\n');
    let html = '<table>';
    
    rows.forEach((row, index) => {
      const cells = row.split('|').filter(cell => cell.trim() !== '');
      const tag = index === 0 ? 'th' : 'td';
      
      html += '<tr>';
      cells.forEach(cell => {
        html += `<${tag}>${cell.trim()}</${tag}>`;
      });
      html += '</tr>';
      
      // Skip the separator row
      if (index === 0) {
        rows.splice(1, 1);
      }
    });
    
    html += '</table>';
    return html;
  };

  // Function to render a message
  const renderMessage = (message) => {
    if (message.sender === 'bot') {
      // Convert any markdown tables to HTML tables if any
      let processedText = message.text.replace(/\|[\s\S]*?\|\n/g, match => {
        return convertMarkdownTableToHtml(match);
      });

      // Split the message into parts: text, image, and table
      const parts = processedText.split(/(<img.*?>|<table[\s\S]*?<\/table>)/);
      return (
        <div className="bot-message-content">
          {parts.map((part, index) => {
            if (part.startsWith('<img') || part.startsWith('<table')) {
              // Render image or table as HTML
              return <div key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(part) }} />;
            } else {
              // Render text as Markdown
              return <ReactMarkdown key={index}>{part.trim()}</ReactMarkdown>;
            }
          })}
        </div>
      );
    } else {
      return message.text; // Render user messages as plain text
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-header">Analyze With Our NoodifyGPT</div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-container ${message.sender}`}>
            {message.sender === 'bot' && (
              <img src={botAvatar} alt="AI" className="avatar" />
            )}
            <div className={`message ${message.sender}`}>
              {renderMessage(message)}
            </div>
            {message.sender === 'user' && (
              <img src={userAvatar} alt="User" className="avatar" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {isLoading && <div>Loading...</div>}
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-l"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot; // Exporting the Chatbot component to be used in app.js
