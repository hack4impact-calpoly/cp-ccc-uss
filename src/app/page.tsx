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

  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (user) {
      const orgs = user.organizationMemberships;
      if (orgs?.some((org) => org.organization.name === "CCC-USS-Admins")) {
        setAdminButton(true);
      } else {
        setAdminButton(false);
        setAdmin(false);
      }
    } else {
      setAdminButton(false);
      setAdmin(false);
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
        }}
      >
        <Navbar />
        <div>
          {adminbutton ? (
            <div>
              <Button
                onClick={() => (admin ? setAdmin(false) : setAdmin(true))}
                mt={3}
                p={6}
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
        <EventSignUp />
        <div className="h-screen"></div>
        <div style={{ width: "70%", margin: "20px" }}>
          <Calendar admin={admin} />
        </div>
      </div>
    </main>
  );
}
