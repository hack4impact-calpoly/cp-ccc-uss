"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Calendar from "@components/Calendar";
import CreateEvent from '@components/CreateEvent/CreateEvent';

export default function Home() {
  const [admin, setAdmin] = useState(false);

  return (
    <main>
        <Navbar />
        <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
        <div style={{width: '70%'}}>
            <Calendar admin={admin} />
          </div>
        </div>
        <CreateEvent />
    </main>
  );
}