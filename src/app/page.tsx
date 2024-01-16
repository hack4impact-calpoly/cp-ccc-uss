"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";

export default function Home() {
  const [apiResponse, setApiResponse] = useState('');

  const handleApiCall = async () => {
    try {
      const response = await fetch('/api/example/');
      const data = await response.json();
      setApiResponse(data.message);
    } catch (error) {
      console.error('Error calling API:', error);
      setApiResponse('Failed to call API');
    }
  };

  return (
    <main>
      <Navbar />
      <h1>Home</h1>
      <button onClick={handleApiCall}>Test Database Connection</button>
      <p>API Response: {apiResponse}</p>
    </main>
  );
}
