"use client";
import React, { useState, useEffect } from "react";
import type { IEvent } from "../../database/eventSchema";
import type {
  IVolunteerRole,
  IVolunteerRoleTimeslot,
} from "../../database/volunteerRoleSchema";
import {
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Input,
  Select,
  Stack,
  Button,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import style from "@styles/EventSignUp.module.css";
import { IFormQuestion } from "@database/volunteerFormSchema";
import { IFormAnswer } from "@database/volunteerEntrySchema";

type IParams = {
  id: string;
};

export default function EventSignUp({ id }: IParams) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<IEvent[]>([]);
  const [roles, setRoles] = useState<IVolunteerRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<IVolunteerRole[]>([]);
  const [shifts, setShifts] = useState<IVolunteerRoleTimeslot[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<{
    [roleId: string]: IVolunteerRoleTimeslot[];
  }>({});
  const [originalShifts, setOriginalShifts] = useState<{
    [roleId: string]: IVolunteerRoleTimeslot[];
  }>({});
  const [questions, setQuestions] = useState<IFormQuestion[]>([]);
  const [answers, setAnswers] = useState<IFormAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchForm(event);
  }, [event]);

  const handleChangeDate = (e: any) => {
    setDate(e.target.value);
  };

  async function fetchEvents() {
    try {
      const response = await fetch(`http://localhost:3000/api/event`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events. Status: ${response.status}`);
      }

      const data = await response.json();
      setEvents(data);
    } catch (err: unknown) {
      console.error("Error:", err);
      setEvents([]);
    }
  }

  async function handleEventInput(eventID: String) {
    try {
      const selectedEvent: IEvent | undefined = events.find(
        (e) => e._id === eventID
      );
      if (selectedEvent) {
        setEvent(selectedEvent);

        const fetchRoles = async () => {
          try {
            const rolesData = await Promise.all(
              selectedEvent.roles.map(async (roleID) => {
                const response = await fetch(
                  `http://localhost:3000/api/role/${roleID}`
                );
                if (!response.ok) {
                  throw new Error(
                    `Failed to fetch role ${roleID}. Status: ${response.status}`
                  );
                }
                return response.json();
              })
            );

            setRoles(rolesData);
          } catch (error) {
            console.error("Error:", error);
            setRoles([]);
          }
        };

        fetchRoles();
      } else {
        setRoles([]);
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      setEvent(null);
    }
  }

  async function fetchForm(event: IEvent | null) {
    try {
      if (event === null) {
        setQuestions([]);
        return;
      }
      const formID = event?.form;
      console.log("FormID: " + formID);
      const response = await fetch(`http://localhost:3000/api/form/${formID}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch event form. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setQuestions(data.questions);
      console.log("Event Form: " + data);
      console.log("Event Questions: " + data.questions);
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  async function handleRoleSelect(roleID: string) {
    try {
      const selectedRole: IVolunteerRole | undefined = roles.find(
        (role) => role?._id === roleID
      );

      if (selectedRole && !selectedRoles.some((role) => role._id === roleID)) {
        setSelectedRoles([...selectedRoles, selectedRole]); // Add selected role to the array if it doesn't already exist
        setShifts(selectedRole.timeslots);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      setShifts([]);
    }
  }
  function handleShiftSelect(shift: IVolunteerRoleTimeslot) {
    setIsLoading(false);
    setSelectedShifts((prevSelectedShifts) => ({
      ...prevSelectedShifts,
      [selectedRoles[selectedRoles.length - 1]._id]: prevSelectedShifts[
        selectedRoles[selectedRoles.length - 1]._id
      ]
        ? [
            ...prevSelectedShifts[selectedRoles[selectedRoles.length - 1]._id],
            shift,
          ]
        : [shift],
    }));
  }

  // clear modal info when close modal (resets)
  function handleClose() {
    setName("");
    setEmail("");
    setDate(new Date());
    handleEventInput("");
    onClose();
  }

  async function getRole(roleID: String) {
    const response = await fetch(`http://localhost:3000/role/${roleID}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch event role. Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  async function getVolunteerId(
    name: string,
    email: string
  ): Promise<string | null> {
    try {
      const response = await fetch(
        `http://localhost:3000/api/volunteer?name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch volunteer. Status: ${response.status}`
        );
      }
      const data = await response.json();

      return data._id; // Assuming the server returns the volunteer object with an _id field
    } catch (error) {
      console.error("Error fetching volunteer:", error);
      return null;
    }
  }

  async function handleSubmission() {
    try {
      const volunteerId = "no bueno :/";
      // const volunteerId = getVolunteerId(name, email);
      // if (!volunteerId) {
      //   throw new Error("Failed to get volunteerId");
      // }

      // Need to get volunteerID in order to post to volunteer entries

      console.log(answers);

      const roleIDs = roles.map((role) => role._id);

      setIsLoading(true);

      // Combine data from all input states (name, email, event, roles/shifts, questions) to POST to VolunteerEntry
      const entryResp = await fetch("http://localhost:3000/api/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event?._id,
          roles: roleIDs,
          volunteerId: volunteerId,
          responses: answers,
        }),
      });

      if (!entryResp.ok) {
        throw new Error(
          `Failed to add volunteer entry. Status: ${entryResp.status}`
        );
      }

      const entryData = await entryResp.json();
      const entryId = entryData._id;

      // PUT to VolunteerRoles (selected timeslots/shifts)
      roles.map(async (role) => {
        const newShifts = selectedShifts[role._id] || [];

        for (const shift of newShifts) {
          // Find the corresponding timeslot in the role's timeslots array
          const timeslotIndex = role.timeslots.findIndex(
            (timeslot) =>
              timeslot.startTime === shift.startTime &&
              timeslot.endTime === shift.endTime
          );

          // Update the volunteers array for the found timeslot
          if (timeslotIndex !== -1 && typeof volunteerId === "string") {
            role.timeslots[timeslotIndex].volunteers.push(volunteerId);
          }
        }

        // Update the role on the server
        const rolRes = await fetch(
          `http://localhost:3000/api/role/${role._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fieldToUpdate: "timeslots",
              value: role.timeslots,
            }),
          }
        );

        if (!rolRes.ok) {
          throw new Error(
            `Failed to update volunteer role with id: ${role._id}. Status: ${rolRes.status}`
          );
        }
      });

      // PUT or PATCH to Volunteer (roles and entries arrays)
      if (false && typeof volunteerId === "string") {
        const volResp = await fetch(
          `http://localhost:3000/api/volunteer/${id}`
        );

        if (!volResp.ok) {
          throw new Error(
            `Failed to fetch volunteer data. Status: ${volResp.status}`
          );
        }

        const volunteer = await volResp.json();
        var entries = volunteer.entries;
        var volRoles = volunteer.roles;
        entries.push(entryId);
        for (let i = 0; i < roles.length; i++) [volRoles.push(roles[i])]; // Push all new roles to roles array

        const putResponse = await fetch(
          `http://localhost:3000/api/volunteer/${volunteerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              entries: entries,
              roles: volRoles,
            }),
          }
        );

        if (!putResponse.ok) {
          throw new Error(
            `Failed to update volunteer entries and roles. Status: ${putResponse.status}`
          );
        }
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      setEvents([]);
    }
  }

  function renderCustomQuestion(question: IFormQuestion, index: number) {
    const handleAnswerBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const updatedAnswer = {
        question: question.question,
        answer: e.target.value,
      };
      setAnswers([...answers, updatedAnswer]);
    };

    const handleMultiChoiceChange = (selectedOption: string) => {
      const existingAnswerIndex = answers.findIndex(
        (answer) => answer.question === question.question
      );

      // Convert the selected option to an array
      const selectedOptions = [selectedOption];

      if (selectedOption) {
        // If an option is selected, update or add the answer
        const updatedAnswer = {
          question: question.question,
          answer: selectedOption,
        };

        if (existingAnswerIndex !== -1) {
          // Update existing answer
          const newAnswers = [...answers];
          newAnswers[existingAnswerIndex] = updatedAnswer;
          setAnswers(newAnswers);
        } else {
          // Add new answer
          setAnswers([...answers, updatedAnswer]);
        }
      } else {
        // If no option is selected, remove the answer if it exists
        if (existingAnswerIndex !== -1) {
          const newAnswers = [...answers];
          newAnswers.splice(existingAnswerIndex, 1);
          setAnswers(newAnswers);
        }
      }
    };

    switch (question.fieldType) {
      case "SHORT_ANSWER":
        return (
          <div>
            <Input
              placeholder="Answer"
              className={style.inputLine}
              borderColor="black"
              onBlur={handleAnswerBlur}
            />
          </div>
        );
      case "MULTI_CHOICE":
        return (
          <div>
            <Stack>
              <RadioGroup onChange={handleMultiChoiceChange}>
                {question.options &&
                  question.options.map((option: string, index) => (
                    <div key={index}>
                      <Radio size="lg" value={option} colorScheme="teal">
                        {option}
                      </Radio>
                    </div>
                  ))}
              </RadioGroup>
            </Stack>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <Button className={style.event} colorScheme="teal" onClick={onOpen}>
        Event Sign Up
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent className={style.modal} maxH="1000px" maxW="1000px">
          <div className={style.content}>
            <div className={style.comp}>
              <ModalCloseButton className={style.close} colorScheme="teal" />
              {events.length > 0 ? (
                <div>
                  <h1 className={style.eventHeader}>Event Sign Up</h1>
                  <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={style.inputLine}
                    borderColor="black"
                  />
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={style.inputLine}
                    borderColor="black"
                  />
                  <Input
                    placeholder="Select Date and Time"
                    type="date"
                    colorScheme="teal"
                    value={new Date(date).toLocaleDateString("en-CA")}
                    onChange={handleChangeDate}
                    borderColor="black"
                    className={style.inputLine}
                  />
                  <Select
                    className={style.inputLine}
                    borderColor="black"
                    placeholder="Select Event"
                    onChange={(e) => {
                      handleEventInput(e.target.value); //Once an event option is picked, call this function with the eventID as arg
                    }}
                  >
                    {events &&
                      events.map((event) => (
                        <option key={event._id} value={event._id}>
                          {" "}
                          {/* whatever value equals is what onChange e.target.value will be */}
                          {event.name}
                        </option>
                      ))}
                  </Select>
                </div>
              ) : (
                <div>
                  <h1>Event Sign Up</h1>
                  <h2>No events found to sign up for.</h2>
                </div>
              )}
              {event ? ( //Do not show this section until there is an event picked
                <div>
                  <Select
                    variant={"filled"}
                    bg="#54948c"
                    className={`${style.inputLine} ${style.shortenedInput}`}
                    colorScheme="teal"
                    color="black"
                    placeholder="Select Role"
                    // icon={<DefaultIcon />}
                    // iconSize="24px"
                    onChange={(e) => {
                      const selectedRoleID = e.target.value;
                      handleRoleSelect(selectedRoleID);
                    }}
                  >
                    {roles.length > 0 &&
                      roles.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.roleName}
                        </option>
                      ))}
                  </Select>
                </div>
              ) : (
                <div></div>
              )}
              {selectedRoles.map((role) => (
                <div key={role._id}>
                  <h3 className={style.smallHeader}>
                    Select Shifts for {role.roleName}:
                  </h3>
                  {role.timeslots.map((shift, index) => (
                    <div key={index}>
                      <Radio
                        type="checkbox"
                        id={`shift-${index}`}
                        value={`shift-${index}`}
                        size="lg"
                        colorScheme="teal"
                        className={style.inputLine}
                        onChange={() => handleShiftSelect(shift)}
                        checked={selectedShifts[role._id]?.includes(shift)}
                      />
                      <label htmlFor={`shift-${index}`}>
                        {`Shift ${index + 1}: ${new Date(
                          shift.startTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - ${new Date(shift.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                      </label>
                    </div>
                  ))}
                </div>
              ))}

              {event ? ( // Don't show this section until there is an event selected.
                <div>
                  {questions.map((question: IFormQuestion, index) => (
                    <div key={index}>
                      <div className={style.smallHeader}>
                        Question: {question.question}
                      </div>
                      <div> {renderCustomQuestion(question, index)} </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div></div>
              )}

              {shifts ? (
                <div className={style.centralize}>
                  <Button
                    type="submit"
                    className={style.submit}
                    isLoading={isLoading}
                    colorScheme="teal"
                    variant="solid"
                    onClick={() => handleSubmission()}
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
