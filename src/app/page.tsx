"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Calendar from "@components/Calendar";
import CreateEvent from '@components/CreateEvent/CreateEvent';
<<<<<<< HEAD
import AdminEventDetails from '@components/AdminEventDetails/AdminEventDetails';

=======
>>>>>>> ad32defdba945cab80db2111241cd848b5220004
export default function Home() {
  const [admin, setAdmin] = useState(true);
  
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
        <AdminEventDetails _id="662f43dcb8ba8d2cc31373b5"/>
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