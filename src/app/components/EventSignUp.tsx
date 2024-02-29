import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import { Input, Radio, RadioGroup, Select } from "@chakra-ui/react";
import style from "@styles/EventSignUp.module.css";

type IParams = {
  id: string;
};

export default function EventSignUp({ id }: IParams) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [roles, setRoles] = useState([]);
  const [questions, setQuestions] = useState([]);
  /* as soon as event state is changed, whole page reloads  */
  /*When looking to hide then show, check if event has been set, if not th4en don't show. If ithas, then show rest */

  async function fetchEvents() {
    try {
      const response = await fetch(`http://localhost:3000/api/event`);
      console.log(response);
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
          <Select placeholder="Select Event">
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
          <h2>No Events found.</h2>
        </div>
      )}
      {/* {event ? <div></div> : <div></div>} This is for roles
      {role ? <div></div> : <div></div>} This is for shift
      {event ? <div></div> : <div></div>} This is for questions */}
    </>
  );
}
