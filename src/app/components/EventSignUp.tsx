import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import type { IVolunteerRole } from "../../database/volunteerRoleSchema";
import { Input, Radio, RadioGroup, Select } from "@chakra-ui/react";
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

      console.log(selectedEvent); //has what I want
      setEvent(selectedEvent[0]);
      console.log(event); // is null

      
      /* Now that we have an event, we can get each of the actual roles we want instead of just ID's */
      // setRoles(data.roles);
      // roles.map(roleID => getRole(roleID));
      // console.log(roles);
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
              handleEventInput(e.target.value);
            }}
          >
            {events &&
              events.map((event) => (
                <option key={event._id} value={event._id}>
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
      {event ? (
        <div>
          <Select variant="filled" placeholder="Select Role">
            {roles &&
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
      {/* {role ? <div></div> : <div></div>} This is for shift
        {event ? <div></div> : <div></div>} This is for questions  */}
    </>
  );
}
