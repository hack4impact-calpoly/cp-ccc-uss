import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from "@mui/x-data-grid";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Chip, Stack } from "@mui/material";
import style from './ProfileDatabase.module.css';

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
