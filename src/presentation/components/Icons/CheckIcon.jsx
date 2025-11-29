import React from 'react';

export const CheckIcon = ({ size = 24, color = '#4caf50' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill={color} fillOpacity="0.15" />
    <path d="M7 13.5L10.5 17L17 10.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
