"use client";
import React, { useState } from "react";
import Navbar from "@components/Navbar";
import Calendar from "@components/Calendar";
import CreateEvent from "@components/CreateEvent/CreateEvent";
import { Button, ChakraProvider } from "@chakra-ui/react";
import EventSignUp from "@components/EventSignUp";

export default function Home() {
  const [admin, setAdmin] = useState(false);

  return (
    <main>
      <Navbar />
      <CreateEvent />
      <EventSignUp/>
      {/* <Calendar /> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>i am the admin: {admin.toString()}</div>
        <button onClick={() => (admin ? setAdmin(false) : setAdmin(true))}>
          secure button
        </button>
        <div style={{ width: "70%", margin: "20px" }}>
          <Calendar admin={admin} />
        </div>
      </div>
      <div style={{ width: "500px", margin: "0 auto", paddingTop: "30px" }}>
        <h3>Login Website</h3>
        {/* <Login /> */}
      </div>
    </main>
  );
}
