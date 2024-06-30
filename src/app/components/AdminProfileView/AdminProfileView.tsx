"use client";
import {
    DataGrid,
    GridRowsProp,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import { IVolunteer } from "@database/volunteerSchema";
import { IVolunteerRole, IVolunteerRoleTimeslot } from "@database/volunteerRoleSchema";
import style from "./AdminProfileView.module.css";
import { useEffect, useState } from "react";
import { Heading } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Select as ChakraReactSelect, OptionBase } from "chakra-react-select";
import { Chip, Stack } from "@mui/material";

interface SelectOption extends OptionBase {
    value: string;
    label: string;
}

interface AdminProfileViewProps {
    email: string;
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
    {
        field: "timeslots", headerName: "Shifts", flex: 1.6,
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
    { field: "description", headerName: "Event Description", flex: 2.2 },
];

export const languageOptions = [
    { value: 'englishFluent', label: 'English fluent' },
    { value: 'spanishFluent', label: 'Spanish fluent' },
    { value: 'englishBasic', label: 'English basic' },
    { value: 'spanishBasic', label: 'Spanish basic' },
]

export const skillOptions = [
    { value: 'legalExpertise', label: 'Legal expertise' },
    { value: 'socialMedia', label: 'Social media experience' },
    { value: 'accounting', label: 'Accounting experience' },
]

export default function AdminProfileView({ email }: AdminProfileViewProps) {
    const [events, setEvents] = useState<GridRowsProp>([]);
    const [languages, setLanguages] = useState<readonly SelectOption[]>([]);
    const [skills, setSkills] = useState<readonly SelectOption[]>([]);
    const [volunteer, setVolunteer] = useState<IVolunteer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const userEmail = email;

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
                    setVolunteer(volunteer);

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
        return <div className={style.loadingError}>Error loading volunteer data.</div>;
    return (
        <>
            <div className={style.mainContainer}>
                <div className={style.userInfo}>
                    <h1 className={style.userName}>{volunteer?.name}</h1>
                    <h1 className={style.email}>{volunteer?.email}</h1>
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
                <Heading as="h2" size="xl" className={style.heading}>
                    Profile Tags
                </Heading>
                <div className={style.tagQuestions}>
                    <div className={style.questionContainer}>
                        <ChakraReactSelect
                            isMulti
                            name="languages"
                            options={languageOptions}
                            placeholder="Languages"
                            value={languages}
                            isReadOnly={true}
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
                            placeholder="Skills/experience"
                            value={skills}
                            isReadOnly={true}
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
                </div>
            </div>
        </>
    );
}