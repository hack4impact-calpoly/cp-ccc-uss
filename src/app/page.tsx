"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Calendar from "@components/Calendar";
import CreateEvent from '@components/CreateEvent/CreateEvent';
import EventSignUp from "@components/EventSignUp";
import ProfileDatabase from '@components/ProfileDatabase';
import { Button, Box } from '@chakra-ui/react';

export default function Home() {
  const [admin, setAdmin] = useState(false);
  const [showProfileDatabase, setShowProfileDatabase] = useState(false);
  
  return (
    <main>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Navbar />
        <Box>Am I the admin? {admin.toString()}</Box>
        <Button onClick={() => (admin ? setAdmin(false) : setAdmin(true))}>
          Secure Button
        </Button>
        <EventSignUp id={"test"} />
        <Box className="h-screen">
        </Box>
        <Box style={{ width: "70%", margin: "20px" }}>
          <Calendar admin={admin} />
        </Box>
        <Box>
          <Button onClick={() => setShowProfileDatabase(!showProfileDatabase)}> Show Profile Database </Button>
          {showProfileDatabase && <ProfileDatabase />}
        </Box>
      </Box>
    </main>
  );
}