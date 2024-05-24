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
    field: "name",
    headerName: "Name",
    headerClassName: `${style.headerRow}`,
    flex: 1,
    renderCell: (params: GridRenderCellParams) => (
      <div>
        <Typography fontWeight={"bold"}>
          {params.value.split("\n")[0]}
        </Typography>
        <Typography>{params.value.split("\n")[1]}</Typography>
      </div>
    ),
  },
  {
    field: "roles",
    headerName: "Roles",
    headerClassName: `${style.headerRow}`,
    flex: 1,
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
    headerClassName: `${style.headerRow}`,
    flex: 1,
    renderCell: (
      params // map volunteer tags to UI chips or "No Tags" chip
    ) => (
      <Stack direction="row" spacing={1} className={style.tags}>
        {params.value && Array.isArray(params.value) ? (
          params.value.map((tag, index) => (
            <Chip
              className={style.tagBubbles}
              key={`${params.id}-tag-${index}`}
              label={tag}
            />
          ))
        ) : (
          <Chip className={style.tagBubbles} label="No Tags" />
        )}
      </Stack>
    ),
  },
];

const headerRowName = (params, index) => {
  if (index === 0) return `${style.firstRow}`;
  else return null;
};

function CustomToolbar() {
  return (
    <GridToolbarContainer className={style.customToolbarContainer}>
      <div className={style.customToolbarSearch}>
        <GridToolbarQuickFilter classes={{ root: "custom-quick-filter" }} />
      </div>
      <div className={style.customToolbarFilterandExport}>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </div>
    </GridToolbarContainer>
  );
}

// const CustomQuickFilterbar = () => {
//   return (
//     <div style={{ height: "64px", padding: "16px", boxSizing: "border-box" }}>
//       {/* Your custom toolbar content */}
//       <input
//         type="text"
//         placeholder="Search by volunteer name, role, past event"
//         style={{ width: "200%", height: "100%", fontSize: "18px" }}
//       />
//     </div>
//   );
// };

export default function ProfileDatabase() {
  const [volunteers, setVolunteers] = useState<IVolunteer[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({});

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

  useEffect(() => {
    const setHeightPerRow = () => {
      let newHeights: { [key: number]: number } = {};
      if (!volunteers) return;
      for (let i = 0; i < volunteers.length; i++) {
        // set the height of this row based on size of data
        let rowHeight = 70;
        if (volunteers[i].roles) {
          rowHeight = Math.max(
            Math.ceil(volunteers[i].roles.length / 2) * 25 + 50,
            70
          );
        }
        if (volunteers[i].tags) {
          rowHeight = Math.max(
            rowHeight,
            Math.ceil(volunteers[i].tags.length / 2) * 25 + 50
          );
        }
        newHeights[volunteers[i]._id] = rowHeight;
        console.log(
          i,
          volunteers[i],
          "height: ",
          newHeights[volunteers[i]._id]
        );
      }
      setRowHeights(newHeights);
    };
    setHeightPerRow();
  }, [volunteers]);

  const getRowHeight = (rows) => {
    // console.log("in getRowHeight, row.id =", rows.id);
    // console.log(rowHeights, rowHeights[rows.id]);
    return rowHeights[rows.id] || 70;
  };

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
      <div style={{ height: "75%", width: "75%", overflowX: "hidden" }}>
        <ThemeProvider theme={pageTheme}>
          <Typography fontSize={24} align="center" paddingBottom={1}>
            Volunteer Database
          </Typography>
          <DataGrid
            style={{ width: "100%" }}
            autoHeight
            rows={volunteers}
            getRowId={(row) => row._id}
            // variableRowHeight
            // wordWrap
            // rowHeight={70}
            getRowHeight={getRowHeight}
            columns={columns}
            getRowClassName={headerRowName}
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
              ".css-1essi2g-MuiDataGrid-columnHeaderRow": {
                fontSize: 18,
              },
              ".css-c63i49-MuiInputBase-input-MuiInput-input": {
                fontSize: 16,
              },
              ".custom-quick-filter": {
                width: "150%",
              },
              ".css-wop1k0-MuiDataGrid-footerContainer": {
                background: "#f6f6f6",
              },
              ".css-gavykb-MuiChip-root": {
                justifyContent: "space",
                marginBottom: 1,
                alignSelf: "left",
              },
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
