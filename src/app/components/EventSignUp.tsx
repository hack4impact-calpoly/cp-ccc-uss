import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import type {
  IVolunteerRole,
  IVolunteerRoleTimeslot,
} from "../../database/volunteerRoleSchema";
import { Input, Select } from "@chakra-ui/react";
import style from "@styles/EventSignUp.module.css";

type IParams = {
  id: string;
};

export default function EventSignUp({ id }: IParams) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState<IEvent[]>([]);
  const [roles, setRoles] = useState<IVolunteerRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<IVolunteerRole[]>([]);
  const [shifts, setShifts] = useState<IVolunteerRoleTimeslot[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<{
    [roleId: string]: IVolunteerRoleTimeslot[];
  }>({});
  const [questions, setQuestions] = useState([]);

  /* as soon as event state is changed, whole page reloads  */
  /*When looking to hide then show, check if event has been set, if not th4en don't show. If ithas, then show rest */

  async function fetchEvents() {
    try {
      const response = await fetch(`http://localhost:3000/api/event`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events. Status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
    } catch (err: unknown) {
      console.error("Error:", err);
      setEvents([]);
    }
  }

  async function getRole(roleID: String) {
    const response = await fetch(`http://localhost:3000/role/${roleID}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch event role. Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  async function handleEventInput(eventID: String) {
    try {
      const selectedEvent: IEvent | undefined = events.find(
        (e) => e._id === eventID
      );
      if (selectedEvent) {
        setEvent(selectedEvent);

        const fetchRoles = async () => {
          try {
            const rolesData = await Promise.all(
              selectedEvent.roles.map(async (roleID) => {
                const response = await fetch(
                  `http://localhost:3000/api/role/${roleID}`
                );
                if (!response.ok) {
                  throw new Error(
                    `Failed to fetch role ${roleID}. Status: ${response.status}`
                  );
                }
                return response.json();
              })
            );

            setRoles(rolesData);
          } catch (error) {
            console.error("Error:", error);
            setRoles([]);
          }
        };

        fetchRoles();
      } else {
        setRoles([]);
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      setEvent(null);
    }
  }

  async function handleRoleSelect(roleID: string) {
    try {
      const selectedRole: IVolunteerRole | undefined = roles.find(
        (role) => role?._id === roleID
      );

      if (selectedRole && !selectedRoles.some((role) => role._id === roleID)) {
        setSelectedRoles([...selectedRoles, selectedRole]); // Add selected role to the array if it doesn't already exist
        setShifts(selectedRole.timeslots);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setShifts([]);
    }
  }
  function handleShiftSelect(shift: IVolunteerRoleTimeslot) {
    setSelectedShifts((prevSelectedShifts) => ({
      ...prevSelectedShifts,
      [selectedRoles[selectedRoles.length - 1]._id]: prevSelectedShifts[
        selectedRoles[selectedRoles.length - 1]._id
      ]
        ? [
            ...prevSelectedShifts[selectedRoles[selectedRoles.length - 1]._id],
            shift,
          ]
        : [shift],
    }));
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      {events.length > 0 ? (
        <div>
          <h1>Event Sign Up</h1>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={style.inputLine}
          />
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={style.inputLine}
          />
          <Select
            variant="filled"
            placeholder="Select Event"
            onChange={(e) => {
              handleEventInput(e.target.value); //Once an event option is picked, call this function with the eventID as arg
            }}
          >
            {events &&
              events.map((event) => (
                <option key={event._id} value={event._id}>
                  {" "}
                  {/* whatever value equals is what onChange e.target.value will be */}
                  {event.name}
                </option>
              ))}
          </Select>
        </div>
      ) : (
        <div>
          <h1>Event Sign Up</h1>
          <h2>No events found to sign up for.</h2>
        </div>
      )}
      {event ? ( //Do not show this section until there is an event picked
        <div>
          <Select
            variant="filled"
            placeholder="Select Role"
            onChange={(e) => {
              const selectedRoleID = e.target.value;
              handleRoleSelect(selectedRoleID);
            }}
          >
            {roles.length > 0 &&
              roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.roleName}
                </option>
              ))}
          </Select>
        </div>
      ) : (
        <div></div>
      )}
      {selectedRoles.map((role) => (
        <div key={role._id}>
          <h3>Select Shifts for {role.roleName}:</h3>
          {role.timeslots.map((shift, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`shift-${index}`}
                value={`shift-${index}`}
                onChange={() => handleShiftSelect(shift)}
                checked={selectedShifts[role._id]?.includes(shift)}
              />
              <label htmlFor={`shift-${index}`}>
                {`Shift ${index + 1}: ${shift.startTime} - ${shift.endTime}`}
              </label>
            </div>
          ))}
        </div>
      ))}

      {/* {role ? <div></div> : <div></div>} This is for shifts, //Do not show this section until there is a role picked
        {event ? <div></div> : <div></div>} This is for questions, //Do not show this section until there is an event picked */}
    </>
  );
}
