import React, {useState, useEffect} from "react"
import type { IEvent } from '../../database/eventSchema'
import { ObjectId } from "mongoose"

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
            <div>
                    <h1>{eventData.name}</h1>
                    <h2>{date}</h2>
                    <h2>{eventData.location}</h2>
                    <h2>{eventData.description}</h2>
                    <button>Sign Up</button>
                </div>
        )
    } else {
        return (
            <p>Event not found.</p>
        )
    }
}