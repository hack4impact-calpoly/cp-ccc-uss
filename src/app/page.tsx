"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import { useSession, signIn, signOut } from 'next-auth/react';

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



if (status === 'loading') return <h1> loading... please wait</h1>;
if (status === 'authenticated') {
  return (

      <main>
        <Navbar />
        <h1>Home</h1>
        <button onClick={handleApiCall}>Test Database Connection</button>
        <p>API Response: {apiResponse}</p>
        <button onClick={() => signIn('google')}>sign in with gooogle</button>
      </main>
    
  );
}
return (
  <div>
    <button onClick={() => signIn('google')}>sign in with gooogle</button>
  </div>
);
}