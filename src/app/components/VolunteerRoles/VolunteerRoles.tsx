import React, { useEffect, useState } from "react";
import {
  IVolunteerRole,
  IVolunteerRoleTimeslot,
} from "@database/volunteerRoleSchema";
import {
  Flex,
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  List,
  ListItem,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { EmptyCircleIcon, PlusCircleIcon } from "../../styles/CustomElements";
import styles from "./VolunteerRoles.module.css";

export default function AddVolunteerRoles(props: {
  roles: IVolunteerRole[];
  setRoles: Function;
  date: Date;
}) {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(
    null
  );
  const [newOptionInputs, setNewOptionInputs] = useState<{
    [index: number]: string;
  }>({});

  const handleOptionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedRoles = [...props.roles];
    const role = updatedRoles[index];
    role.roleName = e.target.value;
    props.setRoles(updatedRoles);
  };

  const handleDeleteOption = (index: number) => {
    const updatedRoles = [...props.roles];
    // Removes the role at the specified index
    updatedRoles.splice(index, 1);
    props.setRoles(updatedRoles);
    if (index === selectedRoleIndex) {
      setSelectedRoleIndex(null);
    }
  };

  const addRole = () => {
    const emptyRole: IVolunteerRole = {
      _id: "",
      roleName: "",
      description: "",
      timeslots: [],
      event: "",
    };
    props.setRoles((prevRoles: any) => [...prevRoles, emptyRole]);
  };
  // Add handleDescriptionChange to update props roles description accordingly
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedRoles = [...props.roles];
    const role = updatedRoles[index];
    role.description = e.target.value;
    props.setRoles(updatedRoles);
  };

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = e.target.value ? parseInt(e.target.value, 10) : null;
    setSelectedRoleIndex(selectedIndex);
  };

  const addShift = (roleIndex: number) => {
    const updatedRoles = [...props.roles];
    const emptyShift: IVolunteerRoleTimeslot = {
      startTime: new Date(),
      endTime: new Date(),
      volunteers: [],
    };
    updatedRoles[roleIndex].timeslots.push(emptyShift);
    props.setRoles(updatedRoles);
  };

  const handleShiftChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    roleIndex: number,
    shiftIndex: number,
    field: keyof IVolunteerRoleTimeslot
  ) => {
    const originalRoles = [...props.roles];
    const updatedRoles = [...props.roles];
    const shift = updatedRoles[roleIndex].timeslots[shiftIndex];
    if (field === "startTime" || field === "endTime") {
      const timeValue = e.target.value;
      const [hours, minutes] = timeValue.split(":").map(Number);

      let existingDate = shift[field];

      if (!existingDate) {
        existingDate = props.date;
      }

      existingDate.setHours(hours);
      existingDate.setMinutes(minutes);
      existingDate.setSeconds(0);
      if (isNaN(existingDate.getTime())) {
        const now = new Date();
        now.setHours(now.getHours() - 7);
        originalRoles[roleIndex].timeslots[shiftIndex][field] = now;
        props.setRoles(originalRoles);
        console.error("Invalid date: ", existingDate.getTime());
        return;
      } else {
        const timezoneOffset = existingDate.getTimezoneOffset();
        existingDate.setMinutes(existingDate.getMinutes() - timezoneOffset);
        updatedRoles[roleIndex].timeslots[shiftIndex][field] = existingDate;
        props.setRoles(updatedRoles);
      }
    }
  };

  const handleDeleteShift = (roleIndex: number, shiftIndex: number) => {
    const updatedRoles = [...props.roles];
    updatedRoles[roleIndex].timeslots.splice(shiftIndex, 1);
    props.setRoles(updatedRoles);
  };

  return (
    <Box maxWidth="463px" mx="auto" className={styles.volunteerroles}>
      <Box>
        <h2 className={styles.role}>Enter Roles</h2>
        <List>
          {props.roles?.map((role, index) => (
            <ListItem
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
            >
              {/* Role name input field */}
              <Flex alignItems="center" mb={2} justifyContent="space-between" w="full">
                <EmptyCircleIcon />
                <Input
                  type="text"
                  value={role.roleName}
                  onChange={(e) => handleOptionInputChange(e, index)}
                  placeholder={`Role ${index + 1}`}
                  flex="1"
                  ml={2}
                  mr={2}
                  variant="unstyled"
                  borderRadius={0}
                  borderColor="customGray"
                  _placeholder={{ color: "placeholder" }}
                  _focus={{ borderColor: "inputBorder" }}
                />
                <IconButton
                  aria-label="Delete role"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteOption(index)}
                  variant="unstyled"
                />
              </Flex>
              {/* Role description input field */}
              <Textarea
                value={role.description}
                onChange={(e) => handleDescriptionChange(e, index)}
                placeholder="Role Description"
                size="sm"
                resize="vertical"
                variant="outline"
                focusBorderColor="blue.500"
                errorBorderColor="red.500"
                minH="50px"
                maxW="100%"
                px={2}
                borderRadius={10}
              />
            </ListItem>
          ))}
          <ListItem>
            <Button
              onClick={addRole}
              leftIcon={<PlusCircleIcon />}
              variant="unstyled"
              color="customGray"
              fontWeight="normal"
              fontStyle={"italic"}
              mb={5}
            >
              Add Role
            </Button>
          </ListItem>
        </List>
      </Box>
      <Box mb={4}>
        <Flex align="center">
          <FormControl flex="1" mr="2">
            <h2 className={styles.role}>Enter Shifts</h2>
          </FormControl>
          <FormControl width="145px">
            <Select
              value={selectedRoleIndex !== null ? selectedRoleIndex : ""}
              color="white"
              bg="teal"
              borderRadius="12px"
              fontSize={14}
              size="sm"
              onChange={handleRoleSelect}
            >
              <option style={{ color: "black" }} value="">
                Select Role
              </option>
              {props.roles.map((role, index) => (
                <option style={{ color: "black" }} key={index} value={index}>
                  {role.roleName}
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        {selectedRoleIndex !== null &&
          props.roles[selectedRoleIndex] &&
          props.roles[selectedRoleIndex].timeslots && (
            <Box>
              <List>
                {props.roles[selectedRoleIndex].timeslots.map(
                  (shift, shiftIndex) => (
                    <ListItem
                      key={shiftIndex}
                      display="flex"
                      alignItems="center"
                    >
                      <Box mr={2}>
                        <EmptyCircleIcon />
                      </Box>

                      <h3>Start: </h3>

                      <Input
                        type="time"
                        value={shift.startTime.toISOString().slice(11, 16)}
                        onChange={(e) =>
                          handleShiftChange(
                            e,
                            selectedRoleIndex,
                            shiftIndex,
                            "startTime"
                          )
                        }
                        placeholder="Start Time"
                        flex="1"
                        ml={2}
                        mr={2}
                        variant="unstyled"
                        borderRadius={0}
                        borderColor="customGray"
                        _placeholder={{ color: "placeholder" }}
                        _focus={{ borderColor: "inputBorder" }}
                      />
                      <h3>|&nbsp;&nbsp;&nbsp;End: </h3>

                      <Input
                        type="time"
                        value={shift.endTime.toISOString().slice(11, 16)}
                        onChange={(e) =>
                          handleShiftChange(
                            e,
                            selectedRoleIndex,
                            shiftIndex,
                            "endTime"
                          )
                        }
                        placeholder="End Time"
                        flex="1"
                        ml={2}
                        mr={2}
                        variant="unstyled"
                        borderRadius={0}
                        borderColor="customGray"
                        _placeholder={{ color: "placeholder" }}
                        _focus={{ borderColor: "inputBorder" }}
                      />
                      <IconButton
                        aria-label="Delete shift"
                        icon={<DeleteIcon />}
                        onClick={() =>
                          handleDeleteShift(selectedRoleIndex, shiftIndex)
                        }
                        variant="unstyled"
                      />
                    </ListItem>
                  )
                )}
                <ListItem>
                  <Button
                    onClick={() => addShift(selectedRoleIndex)}
                    leftIcon={<PlusCircleIcon />}
                    variant="unstyled"
                    color="customGray"
                    fontWeight="normal"
                    fontStyle={"italic"}
                  >
                    Add Shift
                  </Button>
                </ListItem>
              </List>
            </Box>
          )}
      </Box>
    </Box>
  );
}
