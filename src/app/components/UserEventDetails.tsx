import React, {useState, useEffect} from "react"
import type { IEvent } from '../../database/eventSchema'

type IParams = {
    params: {
        _id: string
    }
}

export default function UserEventDetails ({params: { _id } }: IParams) {
    const [eventData, setEventData] = useState<IEvent|null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEventData = async () => {
            if (_id) {
                try {
                    const response = await fetch(`http://localhost:3000/api/event/${_id}`)
                
                    if (!response.ok) {
                        throw new Error(`Failed to fetch blog. Status: ${response.status}`);
                    }

                    const data = await response.json()
                    setEventData(data)
                } catch (err: unknown) {
                    console.error("Error:", err);
                    setError("Failed to load blog");
                } 
            }
        }

        fetchEventData()
    }, [_id])
    
    if (error) return <p>{error}</p>;

    return (
        <div>
            {eventData ? (
                <h1>{eventData.name}</h1>
            ) : (
                <p>Blog not found.</p>
            )}
            
        </div>
    )
}

// get rid of modal stuff, all code should be in the UserEventDetails component. move stuff from main div i modal to return here. Should be passing in the data that was gottent rhoguht he fetch, not necessarily props. 
//should just appear in a box, doesn't ahve to be a popup. rough dimensions of thing in pixels.  