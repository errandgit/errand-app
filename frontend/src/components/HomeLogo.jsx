import React from 'react';

const HomeLogo = ({ width = 220, height = 60 }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 220 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="home-logo"
    >
      {/* Background shapes with animation */}
      <g className="logo-background">
        <rect 
          x="5" y="5" 
          width="50" height="50" 
          rx="10" 
          fill="#0071e3" 
          fillOpacity="0.9"
          className="logo-shape-primary"
        />
        <rect 
          x="15" y="15" 
          width="30" height="30" 
          rx="5" 
          fill="#c8a95b" 
          fillOpacity="0.8"
          className="logo-shape-secondary"
        />
      </g>
      
      {/* Shopping bag icon with animation */}
      <g className="logo-icon">
        <circle 
          cx="30" cy="20" 
          r="2" 
          fill="white"
        />
        <path 
          d="M24 27V32C24 35.3137 26.6863 38 30 38C33.3137 38 36 35.3137 36 32V27" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          className="logo-handle"
        />
        <path 
          d="M20 24H40L38 44H22L20 24Z" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="logo-bag" 
        />
      </g>
      
      {/* Text */}
      <g className="logo-text">
        <text 
          x="65" 
          y="35" 
          fontFamily="SF Pro Display, -apple-system, system-ui, sans-serif" 
          fontWeight="700" 
          fontSize="30" 
          letterSpacing="-0.8" 
          fill="#1d1d1f"
        >
          Errand
        </text>
      </g>

      {/* Accent line with animation */}
      <path 
        d="M65 42H150" 
        stroke="#c04e31" 
        strokeWidth="2" 
        strokeLinecap="round"
        className="logo-accent-line"
      />

      {/* Subtitle */}
      <text 
        x="90" 
        y="52" 
        fontFamily="SF Pro Display, -apple-system, system-ui, sans-serif" 
        fontWeight="400" 
        fontSize="10" 
        letterSpacing="1" 
        fill="#86868b"
      >
        SERVICES MARKETPLACE
      </text>
    </svg>
  );
};

export default HomeLogo;