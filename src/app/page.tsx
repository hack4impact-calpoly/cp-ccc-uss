"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import { useSession, signIn, signOut } from 'next-auth/react';
import Login from './Login';
import Calendar from "@components/Calendar";
import CreateEvent from '@components/CreateEvent/CreateEvent';
import { Button, ChakraProvider } from "@chakra-ui/react";

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
      <p>The following button is styled with ChakraUI:</p>
      <Button colorScheme="blue" onClick={handleApiCall}>Test DB Connection</Button>
      <p>API Response: {apiResponse}</p>
      <Calendar />
      <CreateEvent />
      <div style={{ width: "500px", margin: "0 auto", paddingTop: "30px" }}>
        <h3>Login Website</h3>
        <Login />
      </div>
    </main>
  );
}