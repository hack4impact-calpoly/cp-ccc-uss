"use client";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
} from "@mui/x-data-grid";
import style from "./VolunteerProfile.module.css";
import { useEffect, useState } from "react";
import Navbar from "@components/Navbar";
import { Heading, Button, useDisclosure, Alert, AlertIcon, Box, AlertTitle, AlertDescription, CloseButton } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useUser } from "@clerk/clerk-react";
import { Avatar } from "@mui/material";
import { Select as ChakraReactSelect } from "chakra-react-select";

interface SelectOption {
  value: string;
  label: string;
}

async function getVolunteerID(email: string): Promise<string | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/volunteer`, {
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
      `http://localhost:3000/api/volunteer/${volunteerId}`,
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
    const res = await fetch(`http://localhost:3000/api/entry/${entryId}`, {
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
    const res = await fetch(`http://localhost:3000/api/event/${eventId}`, {
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
    const res = await fetch(`http://localhost:3000/api/role/${roleId}`, {
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

const columns: GridColDef[] = [
  { field: "event", headerName: "Event", width: 300 },
  { field: "role", headerName: "Volunteer Role", width: 300 },
  //{ field: "status", headerName: "Status", width: 300 },
  { field: "date", headerName: "Date", width: 300 },
  { field: "description", headerName: "Event Description", width: 300 },
];

export default function VolunteerProfile() {
  const user = useUser();

  const [events, setEvents] = useState<GridRowsProp>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const userEmail = user?.user?.primaryEmailAddress?.toString() ?? "";

  const { isOpen: isVisible, onClose, onOpen } = useDisclosure();
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const volunteerId = await getVolunteerID(userEmail);
        if (volunteerId) {
          // Get volunteer entries using volunteer ID
          const volunteer = await getVolunteerData(volunteerId);
          const eventPromises = volunteer.entries.map(async (entry: string) => {
            const entryDetails = await getEntryDetails(entry);
            if (entryDetails) {
              const eventDetails = await getEventDetails(entryDetails.eventId);
              if (eventDetails) {
                // get role details for every roleId in entry.roles
                const rolePromises = entryDetails.roles.map(async (roleId: string) => {
                  const roleDetails = await getRoleDetails(roleId);
                  if (roleDetails) {
                    return {
                      id: roleId,
                      event: eventDetails.name,
                      role: roleDetails.roleName,
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
      fetchEvents();
    }
  }, [userEmail]);

  async function handleLanguageSelect(languages: string[]) {
    setLanguages(languages);
  };

  async function handleSkillsSelect(skills: string[]) {
    setSkills(skills);
  }

  async function handleSavePreferences() {
    setButtonLoading(true);
    const tags = languages.concat(skills);

    try {
      const volunteerId = await getVolunteerID(
        user.user?.primaryEmailAddress?.toString() || ""
      );

      console.log("unfinished handlesave, volunteerid: ", volunteerId);
      console.log("tags: ", tags);
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
    <ThemeProvider theme={theme}>
      <div className={style.mainContainer}>
        <Navbar />
        <div className={style.userInfo}>
          <Avatar
            src={user.user?.imageUrl}
            sx={{ width: 100, height: 100 }}
            className={style.avatar}
          />
          <h1 className={style.userName}>Volunteer Profile</h1>
        </div>
        <div className={style.headingContainer}>
          <Heading as="h2" size="xl" className={style.heading}>
            Events
          </Heading>
        </div>
        <div className={style.yellowBar}></div>{" "}
        <div>
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
          />
        </div>
      </div>
    </ThemeProvider>
    <div className={style.questions}>
      <Heading as="h2" size="xl" className={style.heading}>
        Profile Tags
      </Heading>
      <div className={style.tagQuestions}>
        <div className={style.questionContainer}>
          <ChakraReactSelect 
            isMulti 
            name="languages"
            options={[
              { value: 'englishFluent', label: 'English fluent' },
              { value: 'spanishFluent', label: 'Spanish fluent' },
              { value: 'englishBasic', label: 'English basic' },
              { value: 'spanishBasic', label: 'Spanish basic' },
            ]}
            onChange={(selectedOptions) =>
              handleLanguageSelect(
                selectedOptions.map((option) => option.value)
              )
            }
            placeholder="Select languages..."
            chakraStyles={{
              control: (provided, state) => ({
                ...provided,
                borderColor: "black",
                borderRadius: "10px",
                marginBottom: "15px",
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
            options={[
              { value: 'legalExpertise', label: 'Legal expertise' },
              { value: 'socialMedia', label: 'Social media experience' },
              { value: 'accounting', label: 'Accounting experience' },
            ]}
            onChange={(selectedOptions) =>
              handleSkillsSelect(
                selectedOptions.map((option) => option.value)
              )
            }
            placeholder="Select skills/experience..."
            chakraStyles={{
              control: (provided, state) => ({
                ...provided,
                borderColor: "black",
                borderRadius: "10px",
                marginBottom: "15px",
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
