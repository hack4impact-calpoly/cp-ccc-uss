import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import { Input, Select } from '@chakra-ui/react'
import style from "@styles/EventSignUp.module.css";

type IParams = {
  id: string;
};

export default function EventSignUp({ id }: IParams) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState([]);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>EventSignUp
        <div>
        <Input placeholder='Name' onChange={e => setName(e.target.value)}/>
        <Input placeholder='Email' onChange={e => setEmail(e.target.value)}/>
        </div>
    </div>
  );
}