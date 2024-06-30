"use client";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridRenderCellParams,
  GridEventListener,
  GridRowClassNameParams,
  GridRowHeightParams,
} from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Chip, Stack, Typography } from "@mui/material";
import style from "./ProfileDatabase.module.css";
import { IVolunteer } from "@database/volunteerSchema";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { languageOptions, skillOptions } from "@database/TagOptions";
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
} from "@chakra-ui/react";
import AdminProfileView from "@components/AdminProfileView/AdminProfileView";

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

async function getRole(id: string) {
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
          params.value.map((tag, index) => {
            let tagLabel = "";
            let tagColor = "#f6f6f6";
            for (let i = 0; i < languageOptions.length; i++) {
              if (languageOptions[i].value == tag) {
                tagLabel = languageOptions[i].label;
                tagColor = "#DDF9F7";
                break;
              }
            }
            if (tagLabel == "") {
              for (let i = 0; i < skillOptions.length; i++) {
                if (skillOptions[i].value == tag) {
                  tagLabel = skillOptions[i].label;
                  tagColor = "#FFEFD0";
                  break;
                }
              }
            }
            return (
              <Chip
                className={style.tagBubbles}
                key={`${params.id}-tag-${index}`}
                label={tagLabel}
                style={{ backgroundColor: tagColor }}
              />
            );
          })
        ) : (
          <Chip className={style.tagBubbles} label="No Tags" />
        )}
      </Stack>
    ),
  },
];

const headerRowName = (params: GridRowClassNameParams) => {
  if (params.id === 0) {
    return `${style.firstRow}`;
  }
  return '';
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

export default function ProfileDatabase() {
  const [volunteers, setVolunteers] = useState<IVolunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [rowHeights, setRowHeights] = useState<{ [key: number]: number }>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVolunteer, setSelectedVolunteer] = useState("");

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
        const data: IVolunteer[] = await getVolunteers();
        const roleTitlesDict: { [key: string]: string} = {};
        if (data) {
          for (let i = 0; i < data.length; i++) {
            // To place name over email in same column, make the "name" field of IVolunteer hold both
            data[i].name = data[i].name.concat("\n", data[i].email);
            // To display roles, get each role for each volunteer
            let roleTitles = [];
            for (let j = 0; j < data[i].roles.length; j++) {
              if (data[i].roles[j] in roleTitlesDict) {
                roleTitles.push(roleTitlesDict[data[i].roles[j]]);
              } else {
                let roleObj = await getRole(data[i].roles[j]);
                if (roleObj) {
                  roleTitlesDict[data[i].roles[j]] = roleObj.roleName;
                  roleTitles.push(roleObj.roleName);
                }
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

  useEffect(() => {
    const setHeightPerRow = () => {
      let newHeights: { [key: string]: number } = {};
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
            Math.ceil(volunteers[i].tags.length) * 25 + 50
          );
        }
        newHeights[volunteers[i]._id] = rowHeight;
      }
      setRowHeights(newHeights);
    };
    setHeightPerRow();
  }, [volunteers]);

  const getRowHeight = (rows: GridRowHeightParams) => {
    return rowHeights[rows.id as number] || 70;
  };

  const handleRowClick: GridEventListener<'rowClick'> = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details, // GridCallbackDetails
  ) => {
    setSelectedVolunteer(params.row.name.split('\n')[1]);
    console.log("selected volunteer: " + selectedVolunteer);
    onOpen();
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
            getRowHeight={getRowHeight}
            columns={columns}
            getRowClassName={headerRowName}
            onRowClick={handleRowClick}
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
                "Search by volunteer name, role, or tags",
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
          <div style={{ height: "15px" }}></div>
        </ThemeProvider>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent maxW="65%">
          <AdminProfileView email={selectedVolunteer} />
        </ModalContent>
      </Modal>
    </div>
  );
}
