import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from "@mui/x-data-grid";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Chip, Stack } from "@mui/material";
import style from './ProfileDatabase.module.css';
import { IVolunteer } from "@database/volunteerSchema";
import { useEffect, useState } from "react";
import { fail } from "assert";

// const generateData = () => {
//   const data = [];
//   for (let i = 1; i <= 50; i++) {
//     const newData = {
//       id: i,
//       name: `Name${" " + i}`,
//       email: `Email${" " + i}`,
//       tags: `Tags${" " + i}`,
//       "event-type": `Event-Type${" " + i}`,
//     };
//     data.push(newData);
//   }
//   return data;
// };

// const rows: GridRowsProp = generateData();
// get event by id

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

const rows: GridRowsProp = [
  {id: 1,
  name: "Joe Biden",
  email: "joebiden@gmail.com",
  tags: ["Tags 1", "Tags 2", "Tags 3", "Tags 4", "Tags 5", "Tags 6"],
  "eventPreferences": ["Event-Type 1", "Event-Type 2", "Event-Type 3", "Event-Type 4", "Event-Type 5", "Event-Type 6"]},
  {  id: 2,
    name: "Donald Trump",
    email: "donaldtrump@gmail.com",
    tags: ["Tags 4", "Tags 5", "Tags 6"],
    "eventPreferences": ["Event-Type 2",]}];

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 300 },
  { field: "email", headerName: "Email", width: 300 },
  { field: "tags", headerName: "Tags", width: 300,
    renderCell: (params) => (
        <Stack direction={"row"} className={style.tags}>
          {params.row.tags.map((tag: string) => (
            <Chip size="small" label={tag}/>
          ))}
        </Stack>
    )
  },
  { field: "eventPreferences", headerName: "Event Preferences", width: 300, 
  renderCell: (params) => (
    <Stack direction={"row"} className={style.eventPreferences}>
      {params.row.eventPreferences.map((eventPreferences: string) => (
        <Chip size="small" label={eventPreferences}/>
      ))}
    </Stack> 
  )
  },
];

export default function ProfileDatabase() {
  const [volunteers, setVolunteers] = useState<IVolunteer[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const setVolunteersData = async () => { 
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
    };

    setVolunteersData();
  }, []);

  return (
    <div style={{ height: 1000, width: "100%" }}>
        <ThemeProvider theme={createTheme()}>
            <DataGrid 
              rows={rows} 
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
