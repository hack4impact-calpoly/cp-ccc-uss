"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Link from 'next/link';
import Calender from "@components/Calendar";

export default function Page() {
  const [apiResponse, setApiResponse] = useState('');

  return (
    <main>
      <Link href="/">Home</Link>
      <Navbar />
      <h1>Test</h1>
      <p>work!!!</p>
    </main>
  );
}
