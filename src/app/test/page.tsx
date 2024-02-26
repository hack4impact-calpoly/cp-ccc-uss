"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Link from 'next/link';

/* NOTE: this is a demo page to show that clicking on events works
 and loads a component page*/

export default function Page() {

  return (
    <main>
      <Link href="/">Home</Link>
      <Navbar />
      <h1>Test</h1>
      <p>work!!!</p>
    </main>
  );
}
