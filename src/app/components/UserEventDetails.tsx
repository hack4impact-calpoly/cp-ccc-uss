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
          <h1 className={style.eventName}>Event Details</h1>
          <h2 className={style.eventTitle}>{eventData.name}</h2>
          <div className={style.details}>
            <div className={style.info}>
              Date: {new Date(eventData.date).toDateString()}
            </div>
            <div className={style.info}>
              Time:{" "}
              {new Date(eventData.date).toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
              })}
            </div>
            <p className={style.info}>Location: {eventData.location}</p>
            <h2 className={style.description}>
              Description: {eventData.description}
            </h2>
            <div className={style.buttonContainer}>
              <button className={style.button}>Sign Up</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Event not found.</p>
      )}
    </>
  );
}
