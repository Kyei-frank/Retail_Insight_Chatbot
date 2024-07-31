import React from 'react';
import { Link } from 'react-router-dom'; // Importing Link component for navigation
import { FaHome, FaComments, FaChartBar, FaMoneyBill, FaQuestionCircle, FaTimes } from 'react-icons/fa'; // Importing FontAwesome icons
import logo from '../assets/logo.png'; // logo import

function Navbar({ onClose }) {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col">
      {/* Header section with logo and close button */}
      <div className="flex items-center justify-between h-20 border-b border-gray-800 p-4">
        <div className="flex items-center">
          {/* Logo image */}
          <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-3xl font-bold">Noodify AI</h1>
        </div>
        {/* Close button */}
        <button onClick={onClose} className="text-white focus:outline-none">
          <FaTimes />
        </button>
      </div>
      
      {/* Navigation menu */}
      <nav className="flex-1">
        <ul className="p-4">
          {/* Home */}
          <li className="mb-4">
            <Link to="/" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaHome className="mr-2" />
              Home
            </Link>
          </li>
          {/* NoodifyGPT*/}
          <li className="mb-4">
            <Link to="/chatbot" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaComments className="mr-2" />
              NoodifyGPT
            </Link>
          </li>
          {/* Market Insights*/}
          <li className="mb-4">
            <Link to="/market-insights" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaChartBar className="mr-2" />
              Market Insights
            </Link>
          </li>
          {/* Billing*/}
          <li className="mb-4">
            <Link to="/billing" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaMoneyBill className="mr-2" />
              Billing
            </Link>
          </li>
          {/* Help Desk*/}
          <li className="mb-4">
            <Link to="/help-desk" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaQuestionCircle className="mr-2" />
              Help Desk
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar; // Exporting the Navbar component to be used in app.js
