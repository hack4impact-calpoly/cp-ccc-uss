import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from "@mui/x-data-grid";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const generateData = () => {
  const data = [];
  for (let i = 1; i <= 50; i++) {
    const newData = {
      id: i,
      name: `Name${" " + i}`,
      email: `Email${" " + i}`,
      tags: `Tags${" " + i}`,
      "event-type": `Event-Type${" " + i}`,
    };
    data.push(newData);
  }
  return data;
};

const rows: GridRowsProp = generateData();

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Emails", width: 150 },
  { field: "tags", headerName: "Tags", width: 150,},
  { field: "event-type", headerName: "Event Type", width: 150 },
];

export default function ProfileDatabase() {
  return (
    <div style={{ height: 1000, width: "100%" }}>
        <ThemeProvider theme={createTheme()}>
            <DataGrid 
              rows={rows} 
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
