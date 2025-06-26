import React from 'react';

const Logo = ({ width = 150, height = 40 }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 150 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background shapes */}
      <path 
        d="M30 5H10C7.23858 5 5 7.23858 5 10V30C5 32.7614 7.23858 35 10 35H30C32.7614 35 35 32.7614 35 30V10C35 7.23858 32.7614 5 30 5Z" 
        fill="#0071e3" 
        fillOpacity="0.9"
      />
      <path 
        d="M25 10H15C13.3431 10 12 11.3431 12 13V27C12 28.6569 13.3431 30 15 30H25C26.6569 30 28 28.6569 28 27V13C28 11.3431 26.6569 10 25 10Z" 
        fill="#c8a95b" 
        fillOpacity="0.8"
      />
      
      {/* Shopping bag icon */}
      <path 
        d="M20 14C19.4477 14 19 13.5523 19 13C19 12.4477 19.4477 12 20 12C20.5523 12 21 12.4477 21 13C21 13.5523 20.5523 14 20 14Z" 
        fill="white"
      />
      <path 
        d="M16 19V22C16 24.2091 17.7909 26 20 26C22.2091 26 24 24.2091 24 22V19" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path 
        d="M14 16H26L25 26H15L14 16Z" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Text */}
      <text 
        x="45" 
        y="25" 
        fontFamily="SF Pro Display, -apple-system, system-ui, sans-serif" 
        fontWeight="700" 
        fontSize="20" 
        letterSpacing="-0.5" 
        fill="#1d1d1f"
      >
        Errand
      </text>

      {/* Accent line */}
      <path 
        d="M45 28H90" 
        stroke="#c04e31" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />

      {/* Subtitle */}
      <text 
        x="60" 
        y="35" 
        fontFamily="SF Pro Display, -apple-system, system-ui, sans-serif" 
        fontWeight="400" 
        fontSize="8" 
        letterSpacing="0.5" 
        fill="#86868b"
      >
        SERVICES MARKETPLACE
      </text>
    </svg>
  );
};

export default Logo;