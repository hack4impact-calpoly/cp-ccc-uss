import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import style from "@styles/UserEventDetails.module.css";
import { Icon } from '@chakra-ui/react'
import { LuCalendarDays, LuText } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";

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
              <Icon as={LuCalendarDays}
              className={style.icon}
              sx={{ fontSize: 50 }}/>
              <div style={{marginTop: "10px"}}>
              <strong>Date: </strong>{" "}{new Date(eventData.date).toDateString()}
              </div>
            </div>
            {/* removing time for now  */}
            {/* <div className={style.info}>
              Time:{" "}
              {new Date(eventData.date).toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
              })}
            </div> */}
            <div className={style.info}>
              <Icon as={IoLocationOutline}
              className={style.icon}
              sx={{ fontSize: 50 }}/>
              <div style={{marginTop: "10px"}}>
                <strong>Location:</strong>{" " + eventData.location}
              </div>
            </div>
            <div className={style.description}>
              <Icon as={LuText}
              className={style.icon}
              sx={{ fontSize: 50 }}/>
              <div style={{marginTop: "10px", overflow: 'scroll', maxHeight: '400px'}}>
                <strong>Description:</strong>{" " + eventData.description}
              </div>
            </div>
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
