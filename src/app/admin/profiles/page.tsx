"use client";
import * as React from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Chip, Stack, Typography } from "@mui/material";
import style from "./ProfileDatabase.module.css";
import { IVolunteer } from "@database/volunteerSchema";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { Heading } from "@chakra-ui/react";
import { create } from "@mui/material/styles/createTransitions";

//get all volunteers
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

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 300 },
  { field: "email", headerName: "Email", width: 300 },
  {
    field: "tags",
    headerName: "Tags",
    width: 300,
    renderCell: (
      params // map volunteer tags to UI chips or "No Tags" chip
    ) => (
        <Stack direction="row" spacing={1} className={style.tags}>
          {params.value && Array.isArray(params.value) ? (
            params.value.map((tag, index) => (
              <Chip key={`${params.id}-tag-${index}`} label={tag} />
            ))
          ) : (
            <Chip label="No Tags" />
          )}
        </Stack>
    ),
  },
  {
    field: "event-type",
    headerName: "Event Type",
    width: 300,
    renderCell: (
      params // map event prefs to UI chips or "No Event Types" chip
    ) => (
      <Stack direction="row" spacing={1} className={style.eventPreferences}>
        {params.value && Array.isArray(params.value) ? (
          params.value.map((eventType, index) => (
            <Chip key={`${params.id}-event-${index}`} label={eventType} />
          ))
        ) : (
          <Chip label="No Event Types" />
        )}
      </Stack>
    ),
  },
];

export default function ProfileDatabase() {
  const [volunteers, setVolunteers] = useState<IVolunteer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // const pageTheme = createTheme();
  const pageTheme = createTheme({
    typography: {
      button: {
        fontFamily: "Sans-serif",
      },
    },
  });

  useEffect(() => {
    const setVolunteersData = async () => {
      setLoading(true);
      try {
        const data = await getVolunteers();
        if (data) {
          setVolunteers(data);
        } else {
          setError(true);
          console.log("failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching volunteers:", err);
      }
      setLoading(false);
    };

    setVolunteersData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading volunteers.</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Navbar />
      <Heading p={3} fontFamily={"Sans-serif"}>
        Volunteers
      </Heading>
      <div style={{ height: "75%", width: "75%" }}>
        <ThemeProvider theme={pageTheme}>
          <DataGrid
            rows={volunteers}
            getRowId={(row) => row._id}
            rowHeight={70}
            columns={columns}
            disableColumnSelector={true}
            disableDensitySelector={true}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
