
// Importing React library for creating the component
import React from 'react';
// Importing the CSS file for styling the SplashScreen component
import '../styles/SplashScreen.css';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="content">
        <div className="logo-container">
          {/* Displaying the logo image with animation class */}
          <img src="/logo.png" alt="Noodle Logo" className="noodle-logo animate-logo" />
        </div>
        {/* Displaying the slogan */}
        <h1 className="slogan">Transforming Noodle Data Into Market Insight</h1>
      </div>
    </div>
  );
}

// Exporting the SplashScreen component to be used in app.js
export default SplashScreen;
