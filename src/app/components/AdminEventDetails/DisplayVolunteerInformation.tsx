import React, { useState, useEffect } from "react";
import type { IFormAnswer } from "../../../database/volunteerEntrySchema";
import type {
  IVolunteerRole,
} from "../../../database/volunteerRoleSchema";
import style from "./AdminEventDetails.module.css";
import {
  Box,
  Text,
  Heading,
  Flex,
  Avatar,
  IconButton,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

type Props = {
  name: string;
  roles: IVolunteerRole[];
  responses: IFormAnswer[];
  volunteerId: string;
  entryId: string;
  onDelete: () => void;
};

export default function DisplayVolunteerInformation({
  name,
  roles,
  responses,
  volunteerId,
  entryId,
  onDelete,
}: Props) {
  const toast = useToast();

  function parseDate(date: Date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  async function handleEntryDelete() {
    if (
      window.confirm(
        "Are you sure you want to delete this volunteer submission?"
      )
    ) {
      try {
        // Remove volunteer from timeslots in roles
        console.log("roles before deletion", roles);
        const rolesWithUpdatedTimeslots = roles.map((role) => ({
          ...role,
          timeslots: role.timeslots.map((timeslot) => ({
            ...timeslot,
            volunteers: timeslot.volunteers.filter(
              (volunteer) => volunteer !== volunteerId
            ),
          })),
        }));

        console.log("rolesWithUpdatedTimeslots", rolesWithUpdatedTimeslots);

        for (const updatedRole of rolesWithUpdatedTimeslots) {
          await fetch(`/api/role/${updatedRole._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ timeslots: updatedRole.timeslots }),
          });
        }

        // Delete the volunteer entry (api endpoint already
        // removes entry from volunteer.entries array)
        const deleteResponse = await fetch(`/api/entry/${entryId}`, {
          method: "DELETE",
        });
        if (!deleteResponse.ok) {
          throw new Error("Failed to delete volunteer entry");
        } else {
          toast({
            title: "Submission removed",
            description: "The volunteer submission has been successfully removed.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        }

        console.log("Volunteer entry deleted successfully");
        onDelete();
      } catch (error) {
        console.error("Deletion error:", error);
      }
    }
  }

  return (
    <Box p={4} overflow="auto">
      <Flex direction="row" alignItems="center">
        <Avatar name={name} marginRight={3} size="sm" />
        <Heading size="md">{name}</Heading>
        <Spacer />
        <IconButton
          aria-label="Delete volunteer"
          icon={<DeleteIcon />}
          onClick={() => handleEntryDelete()}
          variant="ghost"
          size="sm"
          colorScheme="green"
        />
      </Flex>

      {roles.map((role, index) => (
        <Box key={index} ml={4}>
          <Flex align="center">
            <Box
              w={2}
              h={2}
              borderRadius="full"
              bg="yellow.400"
              mr={2}
              mb={2}
            />
            <Heading size="sm" mb={2}>
              {role.roleName}
            </Heading>
            <Flex className={style.openTime} ml={4}>
              {role.timeslots.map((timeslot, subIndex) => (
                <Text key={subIndex} mb={1} fontSize="sm">
                  {parseDate(timeslot.startTime)} -{" "}
                  {parseDate(timeslot.endTime)}
                  {"\xa0"}
                </Text>
              ))}
            </Flex>
          </Flex>
        </Box>
      ))}
      {responses.map((response, index2) => (
        <Flex key={index2} align="center" ml={4}>
          <Box
            w={4}
            h={4}
            borderRadius="full"
            border="1px solid"
            borderColor="gray.400"
            mr={2}
            mb={5}
          />
          <Box>
            <Text fontWeight="bold">{response.question}</Text>
            <Text>{response.answer}</Text>
          </Box>
        </Flex>
      ))}
    </Box>
  );
}
