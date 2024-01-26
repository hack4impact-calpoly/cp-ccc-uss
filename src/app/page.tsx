"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Calender from "@components/Calender";

export default function Home() {
  const [apiResponse, setApiResponse] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const eventDate = new Date();
  const cal = <Calender/>;
  

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
      <Calender />
    </main>
  );
}
