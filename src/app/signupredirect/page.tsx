"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";

export default function SignUpRedirect() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [volunteerAdded, setVolunteerAdded] = useState(false);

  useEffect(() => {
    if (isSignedIn && isLoaded && user && !volunteerAdded) {
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
              active: true,
            }),
          });
          setVolunteerAdded(true);
          window.location.href = '/volunteerProfile'; // redirect to home page
        } catch (err) {
          console.error("Error adding volunteer:", err);
        }
      };
      addVolunteer();
    }
  }, [isSignedIn, isLoaded, user, volunteerAdded]);

  if (!isSignedIn || !isLoaded) {
    return null;
  }

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
