import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import style from "@styles/UserEventDetails.module.css";

type IParams = {
  id: string;
};

export default function UserEventDetails({ id }: IParams) {
  const [eventData, setEventData] = useState<IEvent | null>(null);

  async function fetchEventData() {
    try {
      const response = await fetch(`http://localhost:3000/api/event/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch event. Status: ${response.status}`);
      }

      const data = await response.json();
      setEventData(data);
    } catch (err: unknown) {
      console.error("Error:", err);
      setEventData(null);
    }
  }

  useEffect(() => {
    fetchEventData();
  }, [id]);

  return (
    <>
      {eventData ? (
        <div className={style.modal}>
          <h1 className={style.eventName}>{eventData.name}</h1>
          <div className={style.details}>
            <h2 className={style.info}>
              Date: {new Date(eventData.date).toDateString()}
            </h2>
            <h2 className={style.info}>Location: {eventData.location}</h2>
            <h2 className={style.info}>Description: {eventData.description}</h2>
            
            <button className={style.button}>Sign Up</button>
            
            
          </div>
        </div>
      ) : (
        <p>Event not found.</p>
      )}
    </>
  );
}
