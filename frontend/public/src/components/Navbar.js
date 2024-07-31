import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaComments, FaChartBar, FaMoneyBill, FaQuestionCircle, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Adjust the path if necessary

function Navbar({ onClose }) {
  return (
    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col">
      <div className="flex items-center justify-between h-20 border-b border-gray-800 p-4">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-3xl font-bold">Noodify AI</h1>
        </div>
        <button onClick={onClose} className="text-white focus:outline-none">
          <FaTimes />
        </button>
      </div>
      <nav className="flex-1">
        <ul className="p-4">
          <li className="mb-4">
            <Link to="/" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaHome className="mr-2" />
              Home
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/chatbot" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaComments className="mr-2" />
              NoodifyGPT
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/market-insights" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaChartBar className="mr-2" />
              Market Insights
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/billing" className="flex items-center p-2 hover:bg-blue-700 rounded">
              <FaMoneyBill className="mr-2" />
              Billing
            </Link>
          </li>
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

export default Navbar;
