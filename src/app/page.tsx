"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import Calendar from "@components/Calendar";
import CreateEvent from "@components/CreateEvent/CreateEvent";
import EventSignUp from "@components/EventSignUp";

import { useUser } from "@clerk/nextjs";
import { Button } from "@chakra-ui/react";

export default function Home() {
  const [admin, setAdmin] = useState(false);
  const [adminbutton, setAdminButton] = useState(false);
  const [signUpButton, setSignUpButton] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (user) {
      const orgs = user.organizationMemberships;
      if (orgs?.some((org) => org.organization.name === "CCC-USS-Admins")) {
        // admin
        setAdminButton(true);
        setSignUpButton(false);
      } else {
        // normal volunteer
        setAdminButton(false);
        setAdmin(false);
        setSignUpButton(true);
      }
    } else {
      // not signed in
      setAdminButton(false);
      setAdmin(false);
      setSignUpButton(false);
    }
  }, [user, isSignedIn, isLoaded]);

  return (
    <main>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          // overflow: "auto",
          // overflowY: "hidden",
        }}
      >
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "70%",
            margin: "0 15%",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: "20px 20px 20px 20px",
              fontSize: "2rem",
              textAlign: "center",
              marginTop: "-1%",
            }}
          >
            Volunteer Events
          </h1>
        </div>
        <div style={{ width: "85%", marginTop: "-1%" }}>
          <Calendar admin={admin} />
        </div>
        {adminbutton ? (
          <div>
            <Button
              onClick={() => (admin ? setAdmin(false) : setAdmin(true))}
              mb={10}
              p={8}
              colorScheme="teal"
            >
              {admin ? (
                <>
                  View as <br /> volunteer
                </>
              ) : (
                <>
                  View as <br /> Admin
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
