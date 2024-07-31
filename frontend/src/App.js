// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import MarketInsights from './components/MarketInsights';
import Billing from './components/Billing';
import HelpDesk from './components/HelpDesk';
import { FaBars } from 'react-icons/fa';
import SplashScreen from './components/SplashScreen';

function App() {
  // State to control the visibility of the navigation bar
  const [isNavOpen, setIsNavOpen] = useState(true);
  // State to control the loading state for the splash screen
  const [isLoading, setIsLoading] = useState(true);

  // Function to toggle the navigation bar
  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  // useEffect to handle the splash screen loading time
  useEffect(() => {
    // Set loading time to 7 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  // Render the splash screen if still loading
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className={`fixed top-0 left-0 h-screen transition-transform duration-300 ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Navbar onClose={handleNavToggle} />
        </div>
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${isNavOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="header">
            {/* Menu button to toggle the navigation bar */}
            {!isNavOpen && (
              <div className="menu-button" onClick={handleNavToggle}>
                <FaBars />
              </div>
            )}
          </div>
          <div className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/market-insights" element={<MarketInsights />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/help-desk" element={<HelpDesk />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App; 
