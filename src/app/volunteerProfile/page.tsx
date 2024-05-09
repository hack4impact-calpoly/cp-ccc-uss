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
//import type {} from "@mui/x-data-grid/themeAugmentation";
import style from "./VolunteerProfile.module.css";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { Heading } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useUser } from "@clerk/clerk-react";
import { Avatar } from "@mui/material";

async function getVolunteers() {
  try {
    const res = await fetch(`http://localhost:3000/api/volunteer/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch volunteers");
    }
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

async function getEntryDetails(entryId: string) {
  try {
    const res = await fetch(
      `http://localhost:3000/api/volunteer-entry/${entryId}`,
      {
        cache: "no-store",
      }
    );

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
  const [volunteers, setVolunteers] = useState<IVolunteer[] | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getVolunteers();
        if (data) {
          setVolunteers(data);
          volunteers?.forEach((volunteer) => {
            volunteer.entries.forEach((entry) => {
              getEntryDetails(entry).then((entryDetails) => {
                if (entryDetails) {
                  getEventDetails(entryDetails.eventId).then((eventDetails) => {
                    if (eventDetails) {
                      setEvents((prevEvents) => [
                        ...prevEvents,
                        {
                          id: entry,
                          event: eventDetails.name,
                          email: volunteer.email,
                          date: eventDetails.date,
                          description: eventDetails.description,
                        },
                      ]);
                    }
                  });
                }
              });
            });
          });
        } else {
          setError(true);
          console.log("failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);
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
            Upcoming Events
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
