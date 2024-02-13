"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import { useSession, signIn, signOut } from 'next-auth/react';
import Login from './Login';
import connectDB from "@database/db";
import eventSchema from "@database/eventSchema"


/////
import UserEventDetails from "@components/UserEventDetails"

export default function Home() {
  const [apiResponse, setApiResponse] = useState('');
  const { data, status } = useSession();

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


  //const events = await Event()
  return (
    <main>
      <Navbar />
      <h1>Home</h1>
      <button onClick={handleApiCall}>Test Database Connection</button>
      <p>API Response: {apiResponse}</p>
      <div style={{ width: "500px", margin: "0 auto", paddingTop: "30px" }}>
        <h3>Login Website</h3>
        <Login />
      </div>
      
      
      <div>
      
      </div>

    </main>
  );
}

async function Event() {
  await connectDB(); // function from db.ts before

  try {
    // query for all events and sort by date
    const events = await eventSchema.find().sort({ date: -1 }).orFail();
    // send a response as the events as the message
    return events;
  } catch (err) {
    return null;
  }
}