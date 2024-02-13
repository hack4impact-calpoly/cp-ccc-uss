"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import { useSession, signIn, signOut } from 'next-auth/react';
import Login from './Login';
import Calendar from "@components/Calendar";
import CreateEvent from '@components/CreateEvent/CreateEvent';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

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

  return (
    <main>
      <Navbar />
      <h1>Home</h1>
      <button onClick={handleApiCall}>Test Database Connection</button>
      <p>API Response: {apiResponse}</p>
      <Calendar />
      {/* note: may want to change LocalizationProvider wrapper to larger scope if use date picker again */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CreateEvent />
      </LocalizationProvider>

      <div style={{ width: "500px", margin: "0 auto", paddingTop: "30px" }}>
        <h3>Login Website</h3>
        <Login />
      </div>
    </main>
  );
}