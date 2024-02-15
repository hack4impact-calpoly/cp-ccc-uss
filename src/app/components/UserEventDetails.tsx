import React, {useState, useEffect} from "react"
import type { IEvent } from '../../database/eventSchema'
import style from "@styles/UserEventDetails.module.css"


type IParams = {
    params: {
      _id: string;
    };
  };


export default function UserEventDetails ({ params }: { params: { _id: string } }) {
    const { _id } = params;
    const [eventData, setEventData] = useState<IEvent|null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventData = async () => {
            if (_id) {
                try {
                    const response = await fetch(`http://localhost:3000/api/event/${_id}`)
                
                    if (!response.ok) {
                        throw new Error(`Failed to fetch event. Status: ${response.status}`);
                    }

                    const data = await response.json()
                    setEventData(data)
                } catch (err: unknown) {
                    console.error("Error:", err);
                    setError("Failed to load event");
                } 
            }
        }

        fetchEventData()
    }, [_id])
    
    if (error) return <p>{error}</p>;

    if (eventData) {
        let date;
        if (eventData.date instanceof Date) {
            date = eventData.date.toDateString();
        } else if (typeof eventData.date === "string") {
            // Handle date string differently (if needed)
            date = new Date(eventData.date).toDateString();
        } else {
            // Handle other cases where date is not a Date object or string
            date = "Invalid Date";
        }

        return (
            <div className={style.modal}>
                <h1 className={style.eventName}>{eventData.name}</h1>
                <div className={style.details}>
                    <h2 className={style.info}>Date: {date}</h2>
                    <h2 className={style.info}>Location: {eventData.location}</h2>
                    <h2 className={style.info}>Description: {eventData.description}</h2>
                    <h2 className={style.info}>Volunteers <span className={style.moreDetails}>More Details</span></h2>
                    <h2 className={style.info}>Open Volunteer Slots</h2>
                    <button className={style.button}>Sign Up</button>
                </div>
                
            </div>
        )
    } else {
        return (
            <p>Event not found.</p>
        )
    }
}