"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Calendar from "@components/Calendar";

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
        <div>i am the admin: {admin.toString()}</div>
        <button onClick={() => (admin ? setAdmin(false) : setAdmin(true))}>
          secure button
        </button>
        <div className="h-screen">
        </div>
        <div style={{ width: "70%", margin: "20px" }}>
          <Calendar admin={admin} />
        </div>
      </div>
    </main>
  );
}