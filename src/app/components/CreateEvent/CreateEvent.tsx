import React, { useState, useEffect } from "react";
import styles from "./CreateEvent.module.css";
import {
  Input,
  Textarea,
  Button,
  Box,
  ModalCloseButton,
} from "@chakra-ui/react";
import { IFormQuestion } from "@database/volunteerFormSchema";
import { IVolunteerRole } from "@database/volunteerRoleSchema";
import AddQuestions from "@components/AddQuestions/AddQuestions";
import { IEvent } from "@database/eventSchema";
import AddVolunteerRoles from "@components/VolunteerRoles/VolunteerRoles";

interface CreateEventProps {
  events: IEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;
  onOpen: () => void;
  onClose: () => void;
  setHasChanges: (hasChanged: boolean) => void;
}

function CreateEvent({
  events,
  setEvents,
  onOpen,
  onClose,
  setHasChanges,
}: CreateEventProps) {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState<Date>(() => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset();
    today.setMinutes(timezoneOffset);
    return today;
  });
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<IFormQuestion[]>([]);
  const [roles, setRoles] = useState<IVolunteerRole[]>([]);
  const [location, setLocation] = useState("");
  const [eventId, setEventId] = useState("61d634706a98a61edd42bf45");
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  const handleChangeName = (e: any) => {
    setHasChanges(true);
    setEventName(e.target.value);
  };

  const handleChangeDesc = (e: any) => {
    setHasChanges(true);
    setDescription(e.target.value);
  };

  const handleChangeDate = (e: any) => {
    setHasChanges(true);
    const selectedDate = new Date(e.target.value);
    const timezoneOffset = selectedDate.getTimezoneOffset();
    selectedDate.setMinutes(timezoneOffset);
    setDate(selectedDate);
  };

  const handleRoleChange = (newRoles: IVolunteerRole[]) => {
    setRoles(newRoles);
    setHasChanges(true);
  };

  const handleQuestionChange = (newQuestions: IFormQuestion[]) => {
    setQuestions(newQuestions);
    setHasChanges(true);
  };

  const clearInputs = () => {
    setEventName("");
    setDate(new Date());
    setDescription("");
    setQuestions([]);
    setRoles([]);
    setLocation("");
  };

  const handleSubmit = async () => {
    let formIdTemp = "";
    let eventIdTemp = "";
    let roleIdTemp: String[] = [];
    // Create form with placeholder eventId
    // Create event with new formId
    // Update form with new eventId

    let errors = [];

    if (!eventName.trim()) {
      errors.push("Event Name");
    }

    if (!(date instanceof Date && !isNaN(date.getTime()))) {
      errors.push("A valid Event Date");
    }

    if (!description.trim()) {
      errors.push("Event Description");
    }

    if (roles.length === 0 || roles.some((role) => !role.roleName.trim())) {
      errors.push("At least one role with a valid name.");
    }

    if (
      questions.length > 0 &&
      questions.some(
        (question) =>
          !question.question.trim() ||
          (question.fieldType === "MULTI_SELECT" &&
            (!question.options ||
              question.options.length === 0 ||
              question.options.some((option) => !option.trim())))
      )
    ) {
      errors.push("Non-empty Questions and/or valid Options");
    }

    if (errors.length > 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      // Create new form with placeholder eventId
      const response1 = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId,
          questions: questions,
        }),
      });

      if (response1.status == 201) {
        const createdForm = await response1.json();
        formIdTemp = createdForm._id;
      } else {
        const err = await response1.text();
        console.error("Error creating Form:", err);
      }

      // create event with new formId
      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: eventName,
          date: date,
          roles: [],
          description: description,
          location: location ? location : "No Location Set",
          form: formIdTemp,
        }),
      });

      if (response.status == 201) {
        const createdEvent = await response.json();
        eventIdTemp = createdEvent._id;
        setEvents([...events, createdEvent]);
        setEventId(createdEvent._id); // save event id for form
        console.log("Event created with ID:", eventIdTemp);
      } else {
        const err = await response.text();
        console.error("Error creating event:", err);
      }

      // Create volunteer roles
      for (const role of roles) {
        const timeslots = role.timeslots.map((timeslot) => ({
          startTime: new Date(
            timeslot.startTime.getTime() + 7 * 60 * 60 * 1000
          ),
          endTime: new Date(timeslot.endTime.getTime() + 7 * 60 * 60 * 1000),
          volunteers: [],
        }));

        const response3 = await fetch("/api/role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roleName: role.roleName,
            description: role.description.trim()
              ? role.description
              : "No Description",
            timeslots: timeslots,
            event: eventIdTemp,
          }),
        });
        if (response3.status === 201) {
          const createdRole = await response3.json();
          roleIdTemp.push(createdRole._id);
          console.log("Role created with ID:", createdRole._id);
        } else {
          const err = await response3.text();
          console.error("Error creating volunteer role:", err);
        }
      }

      // Step 4: Update event with created role IDs
      const updateEventResponse = await fetch(`/api/event/${eventIdTemp}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roles: roleIdTemp,
        }),
      });

      if (updateEventResponse.status === 200) {
        console.log("Event updated with roles:", roleIdTemp);
      } else {
        const err = await updateEventResponse.text();
        console.error("Error updating event with roles:", err);
      }

      // update form with new eventId => now form and event have mutual id's
      const response2 = await fetch("/api/form/" + formIdTemp, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventIdTemp,
          questions: questions,
        }),
      });

      if (response2.status == 201) {
        const changedForm = await response2.json();
      } else {
        const err = await response2.text();
        console.error("Error changing Form:", err);
      }

      clearInputs();
      onClose();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <div className={styles.event}>
      <h2 className={styles.eventHeader}>Create Event</h2>
      <ModalCloseButton />
      <Input
        className={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChange={handleChangeName}
        borderColor="black"
      />
      <Input
        className={styles.input2}
        placeholder="Select Date and Time"
        type="date"
        value={new Date(date).toLocaleDateString("en-CA")}
        onChange={handleChangeDate}
        borderColor="black"
      />
      <Input
        className={styles.input2}
        placeholder="Event Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        borderColor="black"
      />
      <Textarea
        className={styles.input3}
        placeholder="Event Description"
        value={description}
        onChange={handleChangeDesc}
        max-width="463px"
        height="197px"
        borderColor="black"
      />
      <div>
        <AddVolunteerRoles
          roles={roles}
          setRoles={handleRoleChange}
          date={date}
        />
        <AddQuestions
          questions={questions}
          setQuestions={handleQuestionChange}
        />
      </div>
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
          Create Event
        </Button>
      </div>
    </div>
  );
}

export default CreateEvent;
