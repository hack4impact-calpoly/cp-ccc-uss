import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const rows: GridRowsProp = [
  { id: 1, name: "Hello", roles: "World" },
  { id: 2, name: "MUI X", roles: "is awesome" },
  { id: 3, name: "Material UI", roles: "is amazing" },
  { id: 4, name: "MUI", roles: "" },
  { id: 5, name: "Joy UI", roles: "is awesome" },
  { id: 6, name: "MUI Base", roles: "is amazing" },
];

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "roles", headerName: "Roles", width: 150 },
  { field: "events", headerName: "Events", width: 150 },
  { field: "activity", headerName: "Activity", width: 150 },
  { field: "actions", headerName: "Actions", width: 150 },
];

export default function ProfileDatabase() {
  return (
    <div style={{ height: 300, width: "100%" }}>
        <ThemeProvider theme={createTheme()}>
            <DataGrid rows={rows} columns={columns} />
        </ThemeProvider>
    </div>
  );
}
