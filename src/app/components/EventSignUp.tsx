import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import type { IVolunteerRole } from "../../database/volunteerRoleSchema";
import { Input, Select } from "@chakra-ui/react";
import style from "@styles/EventSignUp.module.css";

type IParams = {
  id: string;
};

export default function EventSignUp({ id }: IParams) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState<IVolunteerRole | null>(null);
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
      const selectedEvent = events.filter((e) => e._id === eventID); 

      console.log(selectedEvent[0]); //good log
      setEvent(selectedEvent[0]); // is not doing what I want, event is still null after
      console.log(event); // bad log, is null


      /* Now that we have an event, we can get each of the actual roles we want instead of just using the ID's 
      so that we can display role names*/
      // setRoles(selectedEvent[0].roles);
      // roles.map(roleID => getRole(roleID)); /
      /* ^^^Plan: Turn list of roleID's into role Objects 
      which will be used in the Select Role dropdown */
      // console.log(roles);

      /* ****** From here, the roles section would be implemented similarly to the events, got to get the previous part working, though */
    } catch (err: unknown) {
      console.error("Error:", err);
      setEvent(null);
    }
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
                <option key={event._id} value={event._id}> {/* whatever value equals is what onChange e.target.value will be */}
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
          <Select variant="filled" placeholder="Select Role">
            {roles.length > 0 &&
              roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
          </Select>
        </div>
      ) : (
        <div></div>
      )}
      {/* {role ? <div></div> : <div></div>} This is for shifts, //Do not show this section until there is a role picked
        {event ? <div></div> : <div></div>} This is for questions, //Do not show this section until there is an event picked */}
    </>
  );
}
