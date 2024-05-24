import React, { useState, useEffect } from "react";
import styles from "./CreateEvent/CreateEvent.module.css";
import { Input } from "@chakra-ui/react";
import { Textarea, ModalCloseButton } from "@chakra-ui/react";
import { Button} from "@chakra-ui/react";
import { IFormQuestion } from "@database/volunteerFormSchema";
import { IVolunteerRole } from "@database/volunteerRoleSchema";
import AddQuestions from "@components/AddQuestions/AddQuestions";
import { IEvent } from "@database/eventSchema";

interface EditEventProps {
  event: IEvent[];
  setEvent: React.Dispatch<React.SetStateAction<IEvent[] | null>>;
  onOpen: () => void;
  eventId: string;
  onEventUpdated: (updatedEvent: IEvent) => void;
}

type Props = {
    _id: string ;
};

function EditEvent({ event, setEvent, onClose, eventId, onEventUpdated }: EditEventProps) {
  const [eventName, setEventName] = useState(event.name);
  const [date, setDate] = useState<Date>(new Date(event.date));
  const [description, setDescription] = useState(event.description);
  const [questions, setQuestions] = useState<IFormQuestion[]>(event.questions);
  const [roles, setRoles] = useState<IVolunteerRole[]>(event.roles);
  const [location, setLocation] = useState(event.location);
  const [error, setError] = useState('');

  const btnRef = React.useRef(null);

  const handleChangeName = (e: any) => {
    setEventName(e.target.value);
  };

  const handleChangeDesc = (e: any) => {
    setDescription(e.target.value);
  };

  const handleChangeDate = (e: any) => {
    const selectedDate = new Date(e.target.value);
    // Adjusting for time zone offset
    const timezoneOffset = selectedDate.getTimezoneOffset();
    selectedDate.setMinutes(selectedDate.getMinutes() + timezoneOffset);
    
    setDate(selectedDate);
  };

  if (error) return <div>Error: {error}</div>;

  const handleSubmit = async () => {
    if(!event) return;
  
    try{
        const updateEventResponse = await fetch(`/api/event/${eventId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: eventName,
            date: date,
            roles: roles, 
            description: description,
            questions: questions,
            location: location,
          }),
        });

        if (updateEventResponse.ok) {
          const updatedEvent = await updateEventResponse.json();
          console.log("Event updated successfully:", updatedEvent);
          setEvent(updatedEvent);
          onEventUpdated(updatedEvent);
          onClose(); 
        } else {
          console.error("Error updating event:", await updateEventResponse.text());
        }
    } catch (error) {
      console.error("Error in updating event:", error);
    }
  };

  return (
    <div className={styles.event}>
        <h2 className={styles.eventHeader}>Edit Event</h2>
        <ModalCloseButton/>
        <Input
            placeholder="Event Name"
            value={eventName}
            onChange={handleChangeName}
            borderColor="black"
        />
        <Input
            placeholder="Select Date and Time"
            type="date"
            value={new Date(date).toLocaleDateString("en-CA")}
            onChange={handleChangeDate}
            borderColor="black"
        />
        <Textarea
            placeholder="Event Description"
            value={description}
            onChange={handleChangeDesc}
            width="463px"
            height="197px"
            borderColor="black"
        />
        <div>
            <AddQuestions questions={questions} setQuestions={setQuestions} />
        </div>
        <div className={styles.createEventButton}>
            <Button colorScheme="teal" onClick={handleSubmit}>
                Save
            </Button>
        </div>
    </div>
  );
}

export default EditEvent;
