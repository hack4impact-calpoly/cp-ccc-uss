"use client";
import React, { useState } from 'react';
import Navbar from "@components/Navbar";
import Calendar from "@components/Calendar";
import CreateEvent from '@components/CreateEvent/CreateEvent';
import { useUser } from '@clerk/nextjs';
import { Button } from '@chakra-ui/react';

export default function Home() {
  const [admin, setAdmin] = useState(false);
  let adminbutton = false;

  const { isLoaded, isSignedIn, user } = useUser();
  const admins = process.env.NEXT_PUBLIC_ADMIN_EMAIL_ADDRESSES?.split(",");
  if (user && isSignedIn && isLoaded && user.primaryEmailAddress) {
    if (admins?.includes(user.primaryEmailAddress.emailAddress)) {
      adminbutton = true;
    } else {
      adminbutton = false;
      setAdmin(false);
    }
  }
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
        <div>
          {adminbutton ? (
            <div>
              <Button onClick={() => (admin ? setAdmin(false) : setAdmin(true))} mt={3} p={6} colorScheme="teal">
                {admin ? <>Admin <br/> Change View</> : <>User <br/> Change View</>}
              </Button>
            </div>) :
            null}
        </div>
        <div className="h-screen">
        </div>
        <div style={{ width: "70%", margin: "20px" }}>
          <Calendar admin={admin} />
        </div>
      </div>
    </main>
  );
}