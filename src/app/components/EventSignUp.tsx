"use client";
import React, { useState, useEffect, use } from "react";
import type { IEvent } from "../../database/eventSchema";
import type {
  IVolunteerRole,
  IVolunteerRoleTimeslot,
} from "../../database/volunteerRoleSchema";
import {
  Box,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalCloseButton,
  Select,
  Stack,
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  Text,
  Textarea,
  Heading,
  Collapse,
} from "@chakra-ui/react";
import style from "@styles/EventSignUp.module.css";
import { IFormQuestion } from "@database/volunteerFormSchema";
import { IFormAnswer } from "@database/volunteerEntrySchema";
import { Select as ChakraReactSelect } from "chakra-react-select";
import { useUser } from "@clerk/nextjs";

type EventSignUpProps = {
  prefilledEventId?: string; // optional to prefill modal with event data
  buttonText?: string;
  isEventPast?: boolean;
};

export default function EventSignUp({
  prefilledEventId,
  buttonText,
  isEventPast,
}: EventSignUpProps) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);
  const [roles, setRoles] = useState<IVolunteerRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<IVolunteerRole[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<{
    [roleId: string]: {
      shift: IVolunteerRoleTimeslot;
      isSelected: boolean;
    }[];
  }>({});
  const [questions, setQuestions] = useState<IFormQuestion[]>([]);
  const [answers, setAnswers] = useState<IFormAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [descriptionOpen, setDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [hasChanged, setHasChanged] = useState(false);
  const user = useUser();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchForm();
  }, [event]);

  useEffect(() => {
    if (prefilledEventId && upcomingEvents.length > 0) {
      handleEventInput(prefilledEventId);
    }
  }, [prefilledEventId, upcomingEvents]);

  // clear modal info when close modal (resets)
  function handleClose() {
    if (hasChanged) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        handleEventInput("");
        setDescriptionOpen({});
        onClose();
        setHasChanged(false);
    }
    } else {
      handleEventInput("");
      setDescriptionOpen({});
      onClose();
    }
  }

  async function fetchEvents() {
    try {
      const response = await fetch(`http://localhost:3000/api/event`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events. Status: ${response.status}`);
      }

      const data = await response.json();

      // filter out events that have already passed and sort in chronological order
      const currentDate = new Date();
      const upcomingEvents = data.filter(
        (event: IEvent) => new Date(event.date) >= currentDate
      );
      upcomingEvents.sort((a: IEvent, b: IEvent) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      });
      setUpcomingEvents(upcomingEvents);
    } catch (err: unknown) {
      console.error("Error:", err);
      setUpcomingEvents([]);
    }
  }

  async function handleEventInput(eventID: String) {
    try {
      setEvent(null);
      setAnswers([]);
      setQuestions([]);
      setSelectedRoles([]);
      setRoles([]);
      const selectedEvent: IEvent | undefined = upcomingEvents.find(
        (e) => e._id === eventID
      );
      if (selectedEvent) {
        setEvent(selectedEvent);
        setAnswers([]);

        const fetchRoles = async () => {
          const rolesData = await Promise.all(
            selectedEvent.roles.map(async (roleID) => {
              try {
                const response = await fetch(
                  `http://localhost:3000/api/role/${roleID}`
                );
                if (!response.ok) {
                  console.error(
                    `Failed to fetch role ${roleID}. Status: ${response.status}`
                  );
                  return null;
                }
                return response.json();
              } catch (error) {
                console.error("Error fetching role:", error);
                return null;
              }
            })
          );
          const filteredRoles = rolesData.filter((role) => role !== null);
          setRoles(filteredRoles);
        };

        fetchRoles();
      } else {
        setRoles([]);
        setEvent(null);
        setAnswers([]);
        setQuestions([]);
        setSelectedRoles([]);
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      setRoles([]);
      setEvent(null);
      setAnswers([]);
      setQuestions([]);
      setSelectedRoles([]);
    }
  }

  async function fetchForm() {
    try {
      if (!event || !event.form) {
        setQuestions([]);
        return;
      }
      const formID = event?.form;
      const response = await fetch(`http://localhost:3000/api/form/${formID}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch event form. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error("Error fetching form data:", error);
      setQuestions([]);
      return null;
    }
  }

  async function handleMultiRoleSelect(roleIDs: string[]) {
    setHasChanged(true);
    const newSelectedRoles = roles.filter((role) => roleIDs.includes(role._id));
    setSelectedRoles(newSelectedRoles);

    const newSelectedShifts = { ...selectedShifts };
    newSelectedRoles.forEach((role) => {
      if (!newSelectedShifts[role._id]) {
        newSelectedShifts[role._id] = role.timeslots.map((shift) => ({
          shift,
          isSelected: false,
        }));
      }
    });

    // Remove unselected roles from selectedShifts
    Object.keys(newSelectedShifts).forEach((key) => {
      if (!newSelectedRoles.find((role) => role._id === key)) {
        delete newSelectedShifts[key];
      }
    });

    setSelectedShifts(newSelectedShifts);
  }

  function handleShiftSelect(roleId: string, shiftIndex: number) {
    setHasChanged(true);
    setSelectedShifts((prevSelectedShifts) => {
      const updatedShifts = {
        ...prevSelectedShifts,
        [roleId]: [...prevSelectedShifts[roleId]],
      };

      updatedShifts[roleId][shiftIndex] = {
        ...updatedShifts[roleId][shiftIndex],
        isSelected: !updatedShifts[roleId][shiftIndex].isSelected,
      };

      return updatedShifts;
    });
  }

  function toggleDescription(roleId: string) {
    setDescriptionOpen((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  }

  function renderCustomQuestion(question: IFormQuestion, index: number) {
    const handleAnswerChange = (value: string) => {
      setHasChanged(true);
      const newAnswers = [...answers];
      newAnswers[index] = {
        question: question.question,
        answer: value,
      };
      setAnswers(newAnswers);
    };

    switch (question.fieldType) {
      case "SHORT_ANSWER":
        return (
          <Box>
            <Textarea
              placeholder="Short Answer"
              value={answers[index]?.answer || ""}
              maxLength={500}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className={style.inputLine}
            />
          </Box>
        );
      case "MULTI_SELECT":
      case "MULTI_CHOICE":
        return (
          <Box>
            <Stack>
              <RadioGroup
                value={answers[index]?.answer || ""}
                onChange={(e) => handleAnswerChange(e)}
              >
                <Stack direction="column" spacing={2}>
                  {question.options?.map((option, idx) => (
                    <Radio
                      key={idx}
                      size="lg"
                      value={option}
                      colorScheme="teal"
                    >
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Stack>
          </Box>
        );
      default:
        return null;
    }
  }

  async function getVolunteerIdByEmail(email: string): Promise<string | null> {
    try {
      const response = await fetch(`http://localhost:3000/api/volunteer`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch volunteer. Status: ${response.status}`
        );
      }
      const allVolunteers = await response.json();
      const targetVolunteer = allVolunteers.find(
        (volunteer: { email: string }) => volunteer.email === email
      );

      return targetVolunteer._id;
    } catch (error) {
      console.error("Error fetching volunteer:", error);
      return null;
    }
  }

  async function getExistingRoles(volunteerId: string) {
    const response = await fetch(
      `http://localhost:3000/api/volunteer/${volunteerId}`
    );
    const data = await response.json();
    return data.roles || [];
  }

  async function getExistingEntries(volunteerId: string) {
    const response = await fetch(
      `http://localhost:3000/api/volunteer/${volunteerId}`
    );
    const data = await response.json();
    return data.entries || [];
  }

  async function handleSubmission() {
    setErrorMessage("");

    if (!user.isSignedIn) {
      setErrorMessage("You need to be logged in to complete this operation.");
      return;
    }

    if (!event) {
      setErrorMessage("Please select an event.");
      return;
    }

    if (selectedRoles.length === 0) {
      setErrorMessage("Please select at least one role.");
      return;
    }

    let allShiftsValid = true;
    for (const role of selectedRoles) {
      const shiftsForRole = selectedShifts[role._id];
      if (shiftsForRole && shiftsForRole.length > 0) {
        if (shiftsForRole.every((shift) => !shift.isSelected)) {
          allShiftsValid = false;
          break;
        }
      }
      // If no shifts are present, continue without flagging as an error
    }

    if (!allShiftsValid) {
      setErrorMessage(
        "Please select at least one shift for each role with available shifts."
      );
      return;
    }

    let allAnswersFilled = true;
    for (const question of questions) {
      const answer = answers.find((ans) => ans?.question === question.question);
      if (
        !answer ||
        answer.answer.trim() === "" ||
        (question.fieldType === "MULTI_SELECT" && answer.answer.length === 0)
      ) {
        allAnswersFilled = false;
        break;
      }
    }

    if (!allAnswersFilled) {
      setErrorMessage("Please answer all questions.");
      return;
    }

    try {
      const volunteerId = await getVolunteerIdByEmail(
        user.user?.primaryEmailAddress?.toString() || ""
      );
      const roleIDs = selectedRoles.map((role) => role._id);

      setIsLoading(true);

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

      for (const role of selectedRoles) {
        const selectedShiftsForRole = selectedShifts[role._id].filter(
          (shiftData) => shiftData.isSelected
        );

        const selectedTimeslots = role.timeslots.map((timeslot) => {
          const isSelected = selectedShiftsForRole.some(
            (shiftData) =>
              shiftData.shift.startTime === timeslot.startTime &&
              shiftData.shift.endTime === timeslot.endTime
          );

          if (isSelected) {
            return {
              ...timeslot,
              volunteers: [...timeslot.volunteers, volunteerId],
            };
          }
          return timeslot;
        });

        const roleUpdateResponse = await fetch(
          `http://localhost:3000/api/role/${role._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fieldToUpdate: "timeslots",
              value: selectedTimeslots,
            }),
          }
        );

        if (!roleUpdateResponse.ok) {
          throw new Error(
            `Failed to update volunteer role with id: ${role._id}. Status: ${roleUpdateResponse.status}`
          );
        }

        const roleData = await roleUpdateResponse.json();
      }

      const existingRoles = await getExistingRoles(volunteerId || "");
      const existingEntries = await getExistingEntries(volunteerId || "");

      const volunteerUpdateResponse = await fetch(
        `http://localhost:3000/api/volunteer/${volunteerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roles: Array.from(new Set([...roleIDs, ...existingRoles])),
            entries: [...existingEntries, entryId],
          }),
        }
      );

      if (!volunteerUpdateResponse.ok) {
        throw new Error(
          `Failed to update volunteer data. Status: ${volunteerUpdateResponse.status}`
        );
      }

      setIsLoading(false);
      handleEventInput("");
      setDescriptionOpen({});
      onClose();
      console.log("Submission successful!");
    } catch (err: unknown) {
      console.error("Error:", err);
      setUpcomingEvents([]);
    }
  }

  return (
    <Box m={4}>
      <Button colorScheme="teal" onClick={onOpen} isDisabled={isEventPast}>
        {buttonText || "Event Sign Up"}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="xl"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          className={style.modal}
          maxH="80vh"
          maxW="1000px"
          border="none"
          bg="none"
          boxShadow="none"
        >
          <Box className={style.comp}>
            <ModalCloseButton colorScheme="teal" />
            {upcomingEvents.length > 0 ? (
              <>
                <Heading
                  as="h1"
                  size="lg"
                  mb={5}
                  fontWeight="normal"
                  textAlign="center"
                >
                  Event Sign Up
                </Heading>
                <Select
                  value={event?._id || ""}
                  placeholder="Select Event"
                  onChange={(e) => {
                    handleEventInput(e.target.value);
                  }}
                  className={style.inputLine}
                >
                  {upcomingEvents &&
                    upcomingEvents.map((event) => (
                      <option key={event._id} value={event._id}>
                        {" "}
                        {/* whatever value equals is what onChange e.target.value will be */}
                        {event.name}
                      </option>
                    ))}
                </Select>
              </>
            ) : (
              <Box>
                <Text>No events found to sign up for.</Text>
              </Box>
            )}

            {upcomingEvents.length > 0 && (
              <Box>
                <ChakraReactSelect
                  isMulti
                  name="roles"
                  value={selectedRoles.map((role) => ({
                    value: role._id,
                    label: role.roleName,
                  }))}
                  options={roles.map((role) => ({
                    value: role._id,
                    label: role.roleName,
                  }))}
                  placeholder="Select Roles"
                  closeMenuOnSelect={true}
                  onChange={(selectedOptions) =>
                    handleMultiRoleSelect(
                      selectedOptions.map((option) => option.value)
                    )
                  }
                  chakraStyles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderColor: "black",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: "teal.200",
                    }),
                  }}
                />
              </Box>
            )}

            {selectedRoles.map((role) => (
              <Box key={role._id}>
                <Text as="h3" borderBottom="1px solid black" mb={2}>
                  Select Shifts for {role.roleName}
                  {role.description && role.description.length > 0 && (
                    <Text
                      as="span"
                      ml={2}
                      color="teal.500"
                      cursor="pointer"
                      onClick={() => toggleDescription(role._id)}
                    >
                      (
                      {descriptionOpen[role._id]
                        ? "Hide Description"
                        : "Show Description"}
                      )
                    </Text>
                  )}
                </Text>
                {role.description && role.description.length > 0 && (
                  <Collapse in={descriptionOpen[role._id]} animateOpacity>
                    <Text mb={2}>{role.description}</Text>
                  </Collapse>
                )}
                <Box mb={4}>
                  {selectedShifts[role._id]?.map((shiftData, index) => (
                    <Box key={index}>
                      <Checkbox
                        id={`shift-${role._id}-${index}`}
                        size="lg"
                        colorScheme="teal"
                        onChange={() => handleShiftSelect(role._id, index)}
                        isChecked={shiftData.isSelected}
                      >
                        {`Shift ${index + 1}: ${new Date(
                          shiftData.shift.startTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })} - ${new Date(
                          shiftData.shift.endTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                      </Checkbox>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}

            {upcomingEvents.length > 0 && (
              <Box>
                {questions.map((question: IFormQuestion, index) => (
                  <Box key={index} mb={2}>
                    <Text as="h4" borderBottom="1px solid black" mb={2}>
                      Question: {question.question}
                    </Text>
                    <Box> {renderCustomQuestion(question, index)} </Box>
                  </Box>
                ))}
              </Box>
            )}

            {errorMessage && (
              <Text color="red.500" mb={2}>
                {errorMessage}
              </Text>
            )}

            {upcomingEvents.length > 0 && (
              <Button
                type="submit"
                className={style.submit}
                isLoading={isLoading}
                colorScheme="teal"
                variant="solid"
                alignSelf="center"
                onClick={() => handleSubmission()}
              >
                Submit
              </Button>
            )}
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
