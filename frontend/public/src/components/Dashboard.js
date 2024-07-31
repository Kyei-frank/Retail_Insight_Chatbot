import React, { useRef, useState, useEffect } from 'react';
import { FaBars, FaShoppingCart, FaChartLine, FaBullhorn, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import ScrollToTop from "react-scroll-to-top";
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import image6 from '../assets/image6.jpg';
import image7 from '../assets/image7.jpg';
import image9 from '../assets/image9.jpg';
import image10 from '../assets/image10.jpg';
import image11 from '../assets/image11.jpg';
import noodle1 from '../assets/noodle1.jpg';
import noodle2 from '../assets/noodle2.png';
import noodle3 from '../assets/noodle3.jpg';
import noodle4 from '../assets/noodle4.png';
import logo from '../assets/logo.png';
import '../carousel.css';

const images = [
  image1, image2, image3, image4, image5, image6, 
  image7, image9, image10, image11
];

const noodleImages = [noodle1, noodle2, noodle3, noodle4];

function Dashboard() {
  const sliderContainerRef = useRef(null);
  const [currentNoodleImage, setCurrentNoodleImage] = useState(0);

  const handleMouseEnter = () => {
    sliderContainerRef.current.classList.add('paused');
  };

  const handleMouseLeave = () => {
    sliderContainerRef.current.classList.remove('paused');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNoodleImage((prev) => (prev + 1) % noodleImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <ScrollToTop smooth color="#6f00ff" />
      
      <div className="mt-4 overflow-hidden relative">
        <div 
          className="slider-container" 
          ref={sliderContainerRef} 
          onMouseEnter={handleMouseEnter} 
          onMouseLeave={handleMouseLeave}
        >
          {images.concat(images).map((image, index) => (
            <div key={index} className="slide">
              <img 
                src={image} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-64 object-cover rounded shadow-lg" 
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative text-center py-10">
        <img src={noodle1} alt="Noodle 1" className="w-full h-96 object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
          <h2 className="text-3xl font-bold">NOODIFY AI: REVOLUTIONIZING AFRICAN NOODLE ANALYSIS</h2>
          <p className="mt-2">Turning African Noodle Data into Actionable Market Insights</p>
        </div>
      </div>

      <div className="bg-gray-100 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Unlocking insights and driving growth With our NoodifyGPT</h2>
        </div>
        <div className="flex justify-center space-x-4">
          <div className="max-w-sm bg-white p-4 shadow-lg rounded-lg">
            <img src={noodle2} alt="Noodle 2" className="w-full h-48 object-cover mb-4 rounded-t-lg" />
            <h3 className="text-xl font-bold mb-2">Curious to know more about?</h3>
            <p>* Item Names<br />* Consumer Segments<br />* Cities<br />* Noodle Brands</p>
          </div>
          <div className="max-w-sm bg-white p-4 shadow-lg rounded-lg">
            <img src={noodle3} alt="Noodle 3" className="w-full h-48 object-cover mb-4 rounded-t-lg" />
            <h3 className="text-xl font-bold mb-2">Sales Monitoring?</h3>
            <p>* Giving Sales Volume<br />* AI-Enabled Real-time Reporting from data<br />* Unit Price & Package size</p>
          </div>
          <div className="max-w-sm bg-white p-4 shadow-lg rounded-lg">
            <img src={noodle4} alt="Noodle 4" className="w-full h-48 object-cover mb-4 rounded-t-lg" />
            <h3 className="text-xl font-bold mb-2">Consumer Insights?</h3>
            <p>* Share your Opinion with us<br />* Opinion Surveys<br />* Unlocking Mystery In the data<br />* Engagement with Consumers</p>
          </div>
        </div>
      </div>

      <div className="bg-sky-600 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">NOODIFY AI provides answers to your most pressing questions about African Noodles</h2>
        <div className="flex justify-center mt-8 space-x-4">
          <div className="relative max-w-xs bg-white p-6 rounded-lg shadow-lg text-center">
            <FaShoppingCart className="text-5xl mb-4 text-sky-600" />
            <h3 className="text-lg font-bold text-sky-600">General Inquiry about Sales Trends Across Cities?</h3>
          </div>
          <div className="relative max-w-xs bg-white p-6 rounded-lg shadow-lg text-center">
            <FaChartLine className="text-5xl mb-4 text-sky-600" />
            <h3 className="text-lg font-bold text-sky-600">Which brands and items are driving sales growth?</h3>
          </div>
          <div className="relative max-w-xs bg-white p-6 rounded-lg shadow-lg text-center">
            <FaBullhorn className="text-5xl mb-4 text-sky-600" />
            <h3 className="text-lg font-bold text-sky-600">What are the recent trends in sales?</h3>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">QUICK LINKS</h3>
              <ul>
                <li><a href="#" className="hover:text-gray-300">Contact Us</a></li>
                <li><a href="#" className="hover:text-gray-300">Careers</a></li>
              </ul>
            </div>
            
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">CONNECT WITH US</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
                  <FaFacebookF className="text-gray-900" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full">
                  <FaLinkedinIn className="text-gray-900" />
                </a>
              </div>
            </div>
            
            <div>
              <img src={logo} alt="Maverick Research Logo" className="h-12 mb-2" />
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p>© Copyright 2024 - Noodify AI Team. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
