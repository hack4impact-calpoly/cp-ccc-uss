"use client";
import * as React from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExportContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Chip, Stack, Toolbar, Typography, makeStyles } from "@mui/material";
import style from "./ProfileDatabase.module.css";
import { IVolunteer } from "@database/volunteerSchema";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { Heading } from "@chakra-ui/react";
import { create } from "@mui/material/styles/createTransitions";
import { grey } from "@mui/material/colors";

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

async function getRole(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/role/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch volunteer role");
    }
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

const columns: GridColDef[] = [
  {
    // Now 'name' : '{name}\n{email}'
    field: "name",
    headerName: "Name",
    headerClassName: "super-app-theme--header",
    width: 300,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <Typography>{params.value.split("\n")[0]}</Typography>
        <Typography>{params.value.split("\n")[1]}</Typography>
      </div>
    ),
  },
  {
    field: "roles",
    headerName: "Roles",
    headerClassName: "super-app-theme--header",
    width: 300,
    renderCell: (
      params // map volunteer tags to UI chips or "No Tags" chip
    ) => (
      <Stack direction="row" spacing={1} className={style.tags}>
        {params.value && Array.isArray(params.value) ? (
          params.value.map((role, index) => (
            <Chip key={`${params.id}-role-${index}`} label={role} />
          ))
        ) : (
          <Chip label="No Roles" />
        )}
      </Stack>
    ),
  },
  {
    field: "tags",
    headerName: "Tags",
    headerClassName: "super-app-theme--header",
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
    headerClassName: "super-app-theme--header",
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

function CustomToolbar() {
  return (
    <GridToolbarContainer className={style.customToolbarContainer}>
      <div className={style.customToolbarSearch}>
        <GridToolbarQuickFilter />
      </div>
      <div className={style.customToolbarFilterandExport}>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </div>
    </GridToolbarContainer>
  );
}

export default function ProfileDatabase() {
  const [volunteers, setVolunteers] = useState<IVolunteer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          for (let i = 0; i < data.length; i++) {
            // To place name over email in same column, make the "name" field of IVolunteer hold both
            data[i].name = data[i].name.concat("\n", data[i].email);
            // To display roles, get each role for each volunteer
            let roleTitles = [];
            for (let j = 0; j < data[i].roles.length; j++) {
              let roleObj = await getRole(data[i].roles[j]);
              if (roleObj) {
                roleTitles.push(roleObj.roleName);
              }
            }
            if (roleTitles.length == 0) roleTitles.push("No roles found");
            data[i].roles = roleTitles;
          }
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

  console.log("volunteers:", volunteers);

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
      <div style={{ height: "75%", width: "75%" }}>
        <ThemeProvider theme={pageTheme}>
          <DataGrid
            rows={volunteers}
            getRowId={(row) => row._id}
            rowHeight={70}
            columns={columns}
            slots={{
              toolbar: CustomToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            localeText={{
              toolbarQuickFilterPlaceholder:
                "Search by volunteer name, role, past event",
            }}
            sx={{
              "& .super-app-theme--header": {
                background: "#ffff",
              },
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
