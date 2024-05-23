"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";

export default function SignUpRedirect() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [volunteerAdded, setVolunteerAdded] = useState(false);

  if (isSignedIn) {

    const addVolunteer = async () => {
      try {
        const response = await fetch("/api/volunteer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.fullName,
            email: (user.primaryEmailAddress?.emailAddress?.toLowerCase() ?? ''),
            languages: [],
            roles: [],
            entries: [],
            active: true
          }),
        });
        setVolunteerAdded(true); 
      } catch (err) {
        console.error("Error adding volunteer:", err);
      }
    };

    useEffect(() => {
      if (isLoaded) {
        setVolunteerAdded(false);
      }
    }, [user?.id]);

    useEffect(() => {
      addVolunteer();
    }, [isSignedIn, isLoaded, user])

    return (
      <main>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>this is the redirect page and your name is {user.fullName}</div>
        </div>
      </main>
    );
  }
}