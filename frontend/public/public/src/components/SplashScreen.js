// src/components/SplashScreen.js
import React from 'react';
import '../styles/SplashScreen.css';

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="content">
        <div className="logo-container">
          <img src="/logo.png" alt="Noodle Logo" className="noodle-logo animate-logo" />
        </div>
        <h1 className="slogan">Transforming Noodle Data Into Market Insight</h1>
      </div>
    </div>
  );
}

export default SplashScreen;