"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import { useSession, signIn, signOut } from 'next-auth/react';
import Login from './Login';
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
      <UserEventDetails  params = {{_id: "65b8dd0719caa34c2bffa958"}} />
    </main>
  );
}