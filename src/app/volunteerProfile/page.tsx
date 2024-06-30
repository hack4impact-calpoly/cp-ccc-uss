"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import { IVolunteer } from "@database/volunteerSchema";
import { IVolunteerRole, IVolunteerRoleTimeslot } from "@database/volunteerRoleSchema";
import style from "./VolunteerProfile.module.css";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { Heading, Button, useDisclosure, Alert, AlertIcon, Box, AlertTitle, AlertDescription, CloseButton, Avatar } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useUser } from "@clerk/clerk-react";
import { Select as ChakraReactSelect, OptionBase } from "chakra-react-select";
import { Chip, Stack } from "@mui/material";
import { SignOutButton } from "@components/SignOutButton";
import { languageOptions, skillOptions } from "@database/TagOptions";

interface SelectOption extends OptionBase {
  value: string;
  label: string;
}

const BASE_URL = process.env.API_BASE_URL;

async function getVolunteerID(email: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/volunteer`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch volunteers");
    }

    const allVolunteers = await res.json();
    const targetVolunteer = allVolunteers.find(
      (volunteer: { email: string }) => volunteer.email === email
    );
    if (!targetVolunteer) {
      throw new Error("Volunteer not found");
    }
    return targetVolunteer._id;
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return null;
  }
}

async function getVolunteerData(volunteerId: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/volunteer/${volunteerId}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch volunteer data");
    }
    return res.json();
  } catch (err: unknown) {
    console.error(`error: ${err}`);
    return null;
  }
}

async function getEntryDetails(entryId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/entry/${entryId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch entry details");
    }
    return res.json();
  } catch (err: unknown) {
    console.error(`error: ${err}`);
    return null;
  }
}

async function getEventDetails(eventId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/event/${eventId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch event details");
    }
    return res.json();
  } catch (err: unknown) {
    console.error(`error: ${err}`);
    return null;
  }
}

async function getRoleDetails(roleId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/role/${roleId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch role details");
    }
    return res.json();
  } catch (err: unknown) {
    console.error(`error: ${err}`);
    return null;
  }
}

function getTimeslots(volunteerId: string, roleDetails: IVolunteerRole): IVolunteerRoleTimeslot[] {
  return roleDetails.timeslots.filter((timeslot) => timeslot.volunteers.includes(volunteerId))
}

function dateToShiftTime(date: Date): string {
  var pacificTime = new Date(date);
  // pacificTime.setMinutes(pacificTime.getMinutes() + (7 * 60))
  let hours: number = pacificTime.getHours();
  let minutes: number | string = pacificTime.getMinutes();
  const ampm: string = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes.toString();
  const strTime: string = hours + ':' + minutes + ampm;
  return strTime;
}

const columns: GridColDef[] = [
  { field: "event", headerName: "Event", flex: 1 },
  { field: "role", headerName: "Volunteer Role", flex: 1 },
  { field: "timeslots", headerName: "Shifts", flex: 1.2,
    renderCell: (params) => ( // map timeslots to UI chips or "No Shifts" chip
      <Stack direction="column" className={style.timeslots}>
        {params.value && Array.isArray(params.value) ? params.value.map((timeslot: IVolunteerRoleTimeslot, index) => (
          <Chip key={`${params.id}-tag-${index}`}
                label={`${dateToShiftTime(timeslot.startTime)} - ${dateToShiftTime(timeslot.endTime)}`}
                sx={{
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
          />
        )) : <Chip label="No Shifts" />}
      </Stack>
    )
  },
  { field: "date", headerName: "Date", flex: 1 },
  { field: "description", headerName: "Event Description", flex: 2.5 },
];

export default function VolunteerProfile() {
  const user = useUser();

  const [events, setEvents] = useState<GridRowsProp>([]);
  const [languages, setLanguages] = useState<readonly SelectOption[]>([]);
  const [skills, setSkills] = useState<readonly SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const userEmail = user?.user?.primaryEmailAddress?.toString() ?? "";

  const { isOpen: isVisible, onClose, onOpen } = useDisclosure();
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchEventsandTags = async () => {
      setLoading(true);
      try {
        const volunteerId = await getVolunteerID(userEmail);
        if (volunteerId) {
          // Get volunteer entries using volunteer ID
          const volunteer: IVolunteer = await getVolunteerData(volunteerId);
          const eventPromises = volunteer.entries.map(async (entry: string) => {
            const entryDetails = await getEntryDetails(entry);
            if (entryDetails) {
              const eventDetails = await getEventDetails(entryDetails.eventId);
              if (eventDetails) {
                // get role details for every roleId in entry.roles
                const rolePromises = entryDetails.roles.map(async (roleId: string) => {
                  const roleDetails: IVolunteerRole = await getRoleDetails(roleId);
                  if (roleDetails) {
                    return {
                      id: roleId,
                      event: eventDetails.name,
                      role: roleDetails.roleName,
                      timeslots: getTimeslots(volunteerId, roleDetails),
                      date: new Date(eventDetails.date).toDateString(),
                      description: eventDetails.description,
                    };
                  }
                  return null;
                });
                return Promise.all(rolePromises);
              }
            }
            return null;
          });
          const eventResults = await Promise.all(eventPromises);
          const filteredEvents = eventResults.flat().filter((event) => event !== null);
          setEvents(filteredEvents);

          // get tags from Volunteer and set select values
          setLanguages(languageOptions.filter((opt) => volunteer.tags?.includes(opt.value)))
          setSkills(skillOptions.filter((opt) => volunteer.tags?.includes(opt.value)))
        } else {
          setError(true);
          console.error("Volunteer ID not found.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchEventsandTags();
    }
  }, [userEmail]);

  async function handleSavePreferences() {
    setButtonLoading(true);
    const stringLangs = languages.map((el) => el.value);
    const stringSkills = skills.map((el) => el.value);
    const combinedTags = stringLangs.concat(stringSkills);

    try {
      const volunteerId = await getVolunteerID(
        user.user?.primaryEmailAddress?.toString() || ""
      );

      if (volunteerId) {
        const volunteer = await getVolunteerData(volunteerId);
        const updatedVolunteer = { ...volunteer, tags: combinedTags };

        const response = await fetch(`/api/volunteer/${volunteerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedVolunteer),
        });
        if (response.ok) {
          console.log('Volunteer updated successfully:', updatedVolunteer);
        } else {
          console.error('Failed to update volunteer:', response.statusText);
        }
      }
    } catch (err) {
      console.error("Error saving preferences: ", err);
    } finally {
      setButtonLoading(false);
      onOpen();
    }
  }

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#1976d2",
      },
    },
  });

  if (loading) return <div className={style.loadingError}>Loading...</div>;
  if (error)
    return <div className={style.loadingError}>Error loading volunteers.</div>;
  return (
    <>
      <div className={style.mainContainer}>
        <Navbar />
        <div className={style.userInfo}>
          <Avatar
            src={user.user?.imageUrl}
            marginRight={3}
            size="md"
          />
          <h1 className={style.userName}>{user.user?.fullName}</h1>
          <SignOutButton/>
        </div>
        <ThemeProvider theme={theme}>
          <div className={style.headingContainer}>
            <Heading as="h2" size="xl" className={style.heading}>
              Events
            </Heading>
          </div>
          <div className={style.yellowBar}></div>{" "}
          <div className={style.datagridContainer}>
            <DataGrid
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25, page: 0 },
                },
              }}
              rows={events}
              columns={columns}
              scrollbarSize={10}
              sortModel={[
                {
                  field: "date",
                  sort: "asc",
                },
              ]}
              getRowHeight={() => 'auto'}
              sx={{
                '& .MuiDataGrid-row': {
                  display: 'flex',
                  flexDirection: 'row',
                },
              }}
            />
          </div>
          </ThemeProvider>
        </div>
    <div className={style.questions}>
      <Heading as="h2" size="xl" className={style.heading}>
        Profile Tags
      </Heading>
      <div className={style.tagQuestions}>
        <div className={style.questionContainer}>
          <ChakraReactSelect 
            isMulti 
            name="languages"
            options={languageOptions}
            onChange={setLanguages}
            placeholder="Select languages..."
            value={languages}
            chakraStyles={{
              control: (provided, state) => ({
                ...provided,
                borderColor: "#D0CFCF",
                borderRadius: "10px",
                marginBottom: "10px",
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "teal.200",
              }),
            }}
          />
        </div>
        <div className={style.questionContainer}>
          <ChakraReactSelect 
            isMulti 
            name="skills_experience"
            options={skillOptions}
            onChange={setSkills}
            placeholder="Select skills/experience..."
            value={skills}
            chakraStyles={{
              control: (provided, state) => ({
                ...provided,
                borderColor: "#D0CFCF",
                borderRadius: "10px",
                marginBottom: "10px",
              }),
              multiValue: (provided) => ({
                ...provided,
                backgroundColor: "teal.200",
              }),
            }}
          />
        </div>
        {(isVisible ? (
          <Alert status='success' maxW="sm">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Preferences saved!
              </AlertDescription>
            </Box>
            <CloseButton
              alignSelf='flex-start'
              position='relative'
              right={-1}
              top={-1}
              onClick={onClose}
            />
          </Alert>
        ) : (
          <Button 
            mt={4}
            colorScheme="teal"
            onClick={handleSavePreferences}
            isLoading={buttonLoading}
          >
            Save Preferences
          </Button>
        ))}
      </div>
    </div>
  </>
  );
}
