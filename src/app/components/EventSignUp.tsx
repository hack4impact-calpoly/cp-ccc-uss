"use client";
import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import type { IEvent } from "../../database/eventSchema";
import type {
  IVolunteerRole,
  IVolunteerRoleTimeslot,
} from "../../database/volunteerRoleSchema";
import { Input, Select, Stack, Button } from "@chakra-ui/react";
// import { DefaultIcon } from "@chakra-ui/select";
import style from "@styles/EventSignUp.module.css";
import { IFormQuestion } from "@database/volunteerFormSchema";
import { IFormAnswer } from "@database/volunteerEntrySchema";
import { Radio, RadioGroup } from "@chakra-ui/react";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState<{
    [roleId: string]: IVolunteerRoleTimeslot[];
  }>({});
  const [originalShifts, setOriginalShifts] = useState<{
    [roleId: string]: IVolunteerRoleTimeslot[];
  }>({});
  const [questions, setQuestions] = useState<IFormQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleChangeDate = (e: any) => {
    setDate(e.target.value);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  /* as soon as event state is changed, whole page reloads  */
  /*When looking to hide then show, check if event has been set, if not th4en don't show. If ithas, then show rest */

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

  async function getRole(roleID: String) {
    const response = await fetch(`http://localhost:3000/role/${roleID}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch event role. Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  async function handleSubmission() {
    try {
      /*const resp = await fetch(`http://localhost:3000/api/volunteer`);
      if (!resp.ok) {
        throw new Error(`Failed to fetch events. Status: ${resp.status}`);
      }*/
      // Need to get volunteerID in order to post to volunteer entries

      const responses = questions.map((question) => ({
        question: question?.question,
        answer: "unsure how to get",
      })) as Array<IFormAnswer>;

      const roleIDs = roles.map((role) => role._id);

      // Combine data from all input states (name, email, event, roles/shifts, questions) to POST to VolunteerEntry
      const response = await fetch("http://localhost:3000/api/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event?._id,
          roles: roleIDs,
          volunteerId: "dummy value :(",
          responses: responses,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add volunteer entry. Status: ${response.status}`
        );
      }

      // PUT to VolunteerRoles (selected timeslots/shifts)
      roles.map(async (role) => {
        const originalShifts = role.timeslots;
        const newShifts = selectedShifts[role._id] || [];
        const updatedTimeslots = [...originalShifts, ...newShifts];
        const ret = await fetch(`http://localhost:3000/api/role/${role._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fieldToUpdate: "timeslots",
            value: updatedTimeslots,
          }),
        });

        if (!ret.ok) {
          throw new Error(
            `Failed to update volunteer role with id: ${role._id}. Status: ${response.status}`
          );
        }
      });

      // PUT or PATCH to Volunteer (roles and entries arrays)
    } catch (err: unknown) {
      console.error("Error:", err);
      setEvents([]);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchForm(event);
  }, [event]);

  function renderCustomQuestion(question: IFormQuestion) {
    switch (question.fieldType) {
      case "SHORT_ANSWER":
        return (
          <div>
            <Input
              placeholder="Answer"
              className={style.inputLine}
              borderColor="black"
            />
          </div>
        );
      case "MULTI_CHOICE":
        return (
          <div>
            <Stack>
              {question.options &&
                question.options.map((option: String, index) => (
                  <div key={index}>
                    <Radio size="lg" name="1" colorScheme="teal">
                      {option}
                    </Radio>
                  </div>
                ))}
            </Stack>
          </div>
        );
    }
  }

  return (
    <div>
      <Button className={style.event} colorScheme="teal" onClick={openModal}>
        Event Sign Up
      </Button>
      <ReactModal
        className={style.modal}
        isOpen={showModal}
        onRequestClose={closeModal}
      >
        <div className={style.content}>
          <div className={style.comp}>
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
                    <div> {renderCustomQuestion(question)} </div>
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
      </ReactModal>
    </div>
  );
}
