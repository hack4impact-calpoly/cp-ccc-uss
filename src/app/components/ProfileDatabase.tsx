import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const rows: GridRowsProp = [
    { id: 1, name: "Name1", roles: "Role1", events: "Event 1", activity: "Activity 1", actions: "Action 1" },
    { id: 2, name: "Name2", roles: "Role2", events: "Event 2", activity: "Activity 2", actions: "Action 2" },
    { id: 3, name: "Name3", roles: "Role3", events: "Event 3", activity: "Activity 3", actions: "Action 3" },
    { id: 4, name: "Name4", roles: "Role4", events: "Event 4", activity: "Activity 4", actions: "Action 4" },
    { id: 5, name: "Name5", roles: "Role5", events: "Event 5", activity: "Activity 5", actions: "Action 5" },
    { id: 6, name: "Name6", roles: "Role6", events: "Event 6", activity: "Activity 6", actions: "Action 6" },
    { id: 7, name: "Name7", roles: "Role7", events: "Event 7", activity: "Activity 7", actions: "Action 7" },
    { id: 8, name: "Name8", roles: "Role8", events: "Event 8", activity: "Activity 8", actions: "Action 8" },
    { id: 9, name: "Name9", roles: "Role9", events: "Event 9", activity: "Activity 9", actions: "Action 9" },
    { id: 10, name: "Name10", roles: "Role10", events: "Event 10", activity: "Activity 10", actions: "Action 10" },
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
