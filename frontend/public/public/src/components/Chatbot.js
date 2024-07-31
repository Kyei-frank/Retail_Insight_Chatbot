import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import './Chatbot.css'; // Make sure to create this CSS file

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const userAvatar = "https://placehold.co/30x30/blue/white?text=U";
  const botAvatar = "https://placehold.co/30x30/green/white?text=AI";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log("Messages updated:", messages);
  }, [messages]);

  useEffect(() => {
    console.log("Chatbot component mounted");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);
    console.log("Sending request to backend...");
    
    const chat_history = messages.map(msg => `${msg.sender}: ${msg.text}`);
    
    const requestBody = {
      input: input,
      tool_llm_name: "gpt-4o",
      agent_llm_name: "gpt-4o",
      chat_history: chat_history
    };
    console.log("Sending request with body:", JSON.stringify(requestBody));
    
    try {
      const response = await fetch('https://hackathon-l1cf.onrender.com/query', {
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
      setMessages(prevMessages => [...prevMessages, botReply]);
    } catch (error) {
      console.error('Error details:', error);
      setMessages(prevMessages => [...prevMessages, { text: "An error occurred. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message) => {
    if (message.sender === 'bot') {
      // Check if the message contains an HTML table
      if (message.text.includes('<table>')) {
        return (
          <div className="table-container" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.text) }} />
        );
      } else {
        return <ReactMarkdown>{message.text}</ReactMarkdown>;
      }
    } else {
      return message.text;
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

export default Chatbot;
