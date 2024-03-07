"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Calendar from "@components/Calendar";
import CreateEvent from '@components/CreateEvent/CreateEvent';

export default function Home() {
  const [admin, setAdmin] = useState(false);
  
  return (
    <main>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Navbar />
        <div style={{ width: "70%", margin: "20px" }}>
          <CreateEvent/>
          <Calendar admin={admin} />
        </div>
      </div>
    </main>
  );
}