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
  events: IEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  onOpen: () => void;
  onClose: () => void;
  eventId: string;
}

type Props = {
    _id: string ;
};

function EditEvent({ events, setEvents, onOpen, onClose, eventId }: EditEventProps) {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<IFormQuestion[]>([]);
  const [roles, setRoles] = useState<IVolunteerRole[]>([]);
  const [location, setLocation] = useState("default location");
  // const [eventId, setEventId] = useState("663c2f0ed3954490f0c0c846");
  const [loading, setLoading] = useState(true);
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

  const clearInputs = () => {
    setEventName("");
    setDate(new Date());
    setDescription("");
    setQuestions([]);
    setRoles([]);
    setLocation("default location");
  };

  const fetchEventData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/event/${eventId}`);
      const eventData = await response.json();

      if (response.ok) {
        setEventName(eventData.name);
        setDate(new Date(eventData.date));
        setDescription(eventData.description);
        setQuestions(eventData.questions);
        setRoles(eventData.roles);
        setLocation(eventData.location);
      } else {
        throw new Error(`Failed to fetch event data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError(`Failed to load event details. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSubmit = async () => {
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
          setEvents(events.map(event => event._id === eventId ? updatedEvent : event)); 
          clearInputs();
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
