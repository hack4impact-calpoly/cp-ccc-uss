"use client";
import { IVolunteer } from "@database/volunteerSchema";
import { IVolunteerEntry } from "@database/volunteerEntrySchema";
import { IEvent } from "@database/eventSchema";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import style from "./VolunteerProfile.module.css";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { Heading } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useUser } from "@clerk/clerk-react";
import { Avatar } from "@mui/material";

async function getVolunteerID(email: string): Promise<string | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/volunteer`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch volunteers");
    }

    const allVolunteers = await res.json();
    const targetVolunteer = allVolunteers.find(
      (volunteer: { email: string }) => volunteer.email === email
    );
    if (!targetVolunteer) {
      throw new Error("Volunteer not found");
    }
    console.log(targetVolunteer._id);
    return targetVolunteer._id;
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return null;
  }
}

async function getVolunteerData(volunteerId: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/volunteer/${volunteerId}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch volunteer data");
    }
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

async function getEntryDetails(entryId: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/entry/${entryId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch entry details");
    }
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

async function getEventDetails(eventId: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/event/${eventId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch event details");
    }
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}
const columns: GridColDef[] = [
  { field: "event", headerName: "Event Requested", width: 300 },
  { field: "email", headerName: "Email", width: 300 },
  //{ field: "status", headerName: "Status", width: 300 },
  { field: "date", headerName: "Date & Time", width: 300 },
  { field: "description", headerName: "Description", width: 300 },
];

export default function VolunteerProfile() {
  const user = useUser();

  const [events, setEvents] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const userEmail = user?.user?.primaryEmailAddress?.toString() ?? "";

  useEffect(() => {
    console.log("Fetching events...");
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const volunteerId = await getVolunteerID(userEmail);
        console.log("email: ", userEmail);
        console.log("ID: ", volunteerId);
        if (volunteerId) {
          // Get volunteer entries using volunteer ID
          const volunteer = await getVolunteerData(volunteerId);
          const eventPromises = volunteer.entries.map(async (entry: string) => {
            const entryDetails = await getEntryDetails(entry);
            if (entryDetails) {
              const eventDetails = await getEventDetails(entryDetails.eventId);
              if (eventDetails) {
                return {
                  id: entry,
                  event: eventDetails.name,
                  email: volunteer.email,
                  date: new Date(eventDetails.date).toLocaleString(),
                  description: eventDetails.description,
                };
              }
            }
            return null;
          });
          const eventResults = await Promise.all(eventPromises);
          const filteredEvents = eventResults.filter((event) => event !== null);
          setEvents(filteredEvents);
        } else {
          setError(true);
          console.error("Volunteer ID not found.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchEvents();
    }
  }, [userEmail]);
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
      },
    },
  });

  if (loading) return <div className={style.loadingError}>Loading...</div>;
  if (error)
    return <div className={style.loadingError}>Error loading volunteers.</div>;
  return (
    <ThemeProvider theme={theme}>
      <div className={style.mainContainer}>
        <Navbar />
        <div className={style.userInfo}>
          <Avatar
            src={user.user?.imageUrl}
            sx={{ width: 100, height: 100 }}
            className={style.avatar}
          />
          <h1 className={style.userName}>Volunteer Profile</h1>
        </div>
        <div className={style.headingContainer}>
          <Heading as="h2" size="xl" className={style.heading}>
            Events
          </Heading>
        </div>
        <div className={style.yellowBar}></div>{" "}
        <div>
          <DataGrid
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            rows={events}
            columns={columns}
            scrollbarSize={10}
            sortModel={[
              {
                field: "date",
                sort: "asc",
              },
            ]}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
