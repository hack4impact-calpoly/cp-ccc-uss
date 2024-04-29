import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from "@mui/x-data-grid";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Chip, Stack } from "@mui/material";
import style from './ProfileDatabase.module.css';
import { IVolunteer } from "@database/volunteerSchema";
import { useEffect, useState } from "react";

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
  { field: "tags", headerName: "Tags", width: 300,
    renderCell: (params) => (
      <Stack direction="row" spacing={1} className={style.tags}>
        {params.value && Array.isArray(params.value) ? params.value.map((tag, index) => (
          <Chip key={`${params.id}-tag-${index}`} label={tag} />
        )) : <Chip label="No Tags" />}  
      </Stack>
    )
  },
  { field: "event-type", headerName: "Event Type", width: 300,
    renderCell: (params) => (
      <Stack direction="row" spacing={1} className={style.eventPreferences}>
        {params.value && Array.isArray(params.value) ? params.value.map((eventType, index) => (
          <Chip key={`${params.id}-event-${index}`} label={eventType} />
        )) : <Chip label="No Event Types" />} 
      </Stack>
    )
  },
];

export default function ProfileDatabase() {
  const [volunteers, setVolunteers] = useState<IVolunteer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
    <div style={{ height: 1000, width: "100%" }}>
        <ThemeProvider theme={createTheme()}>
            <DataGrid 
              rows={volunteers} 
              getRowId={(row)=> row._id}
              rowHeight={70}
              columns={columns}
              slots={
                {
                  toolbar: GridToolbar
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true
              }
              }}
            />
        </ThemeProvider>
    </div>
  );
}
