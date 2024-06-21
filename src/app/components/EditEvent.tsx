import React, { useState, useEffect } from "react";
import styles from "./CreateEvent/CreateEvent.module.css";
import { Textarea, ModalCloseButton, Button, Box, Input } from "@chakra-ui/react";
import { IEvent } from "@database/eventSchema";

interface EditEventProps {
  event: IEvent;
  onClose: () => void;
  eventId: string;
  onEventUpdated: (updatedEvent: IEvent) => void;
}

function EditEvent({
  event,
  onClose,
  eventId,
  onEventUpdated,
}: EditEventProps) {
  const [eventName, setEventName] = useState(event.name);
  const [date, setDate] = useState<Date>(new Date(event.date));
  const [description, setDescription] = useState(event.description);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

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

  const handleSubmit = async () => {
    if (!event) return;

    let errors = [];

    if (!eventName.trim()) {
      errors.push("Event Name");
    }

    if (!(date instanceof Date && !isNaN(date.getTime()))) {
      errors.push("A Valid Event Date");
    }

    if (!description.trim()) {
      errors.push("Event Description");
    }

    if (errors.length > 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      const updateEventResponse = await fetch(`/api/event/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: eventName,
          date: date,
          roles: event.roles,
          description: description,
          location: event.location,
          form: event.form,
        }),
      });

      if (updateEventResponse.ok) {
        const updatedEvent = await updateEventResponse.json();
        console.log("Event updated successfully:", updatedEvent);
        onEventUpdated(updatedEvent);
        onClose();
      } else {
        console.error(
          "Error updating event:",
          await updateEventResponse.text()
        );
      }
    } catch (error) {
      console.error("Error in updating event:", error);
    }
  };

  return (
    <div className={styles.event}>
      <h2 className={styles.eventHeader}>Edit Event</h2>
      <ModalCloseButton />
      <Input
        placeholder="Event Name"
        value={eventName}
        onChange={handleChangeName}
        borderColor="black"
        marginBottom={5}
        marginTop={5}
      />
      <Input
        placeholder="Select Date and Time"
        type="date"
        value={new Date(date).toLocaleDateString("en-CA")}
        onChange={handleChangeDate}
        borderColor="black"
        marginBottom={5}
      />
      <Textarea
        placeholder="Event Description"
        value={description}
        onChange={handleChangeDesc}
        width="463px"
        height="197px"
        borderColor="black"
        marginBottom={5}
      />
      {errorMessage.length > 0 && (
        <Box color="red.500" mb={2} ml={5}>
          Please add the following missing fields:
          <ul>
            {errorMessage.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Box>
      )}
      <div className={styles.createEventButton}>
        <Button colorScheme="teal" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditEvent;
