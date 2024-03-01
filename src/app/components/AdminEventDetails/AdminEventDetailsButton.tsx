"use client";
import React from 'react';

export default function AdminEventDetailsButton() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <button onClick={handleClick}
    style={{ 
    background: 'transparent', 
    border: 'none', 
    textDecoration: 'underline', 
    color: 'black', 
    cursor: 'pointer',
    fontFamily: 'Avenir',
    fontSize: '16px',
  }}>
    more details 
    </button>;
}