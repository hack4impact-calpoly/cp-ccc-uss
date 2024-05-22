import React, { useState, useEffect } from "react";
import type {
  IVolunteerEntry,
  IFormAnswer,
} from "../../../database/volunteerEntrySchema";
import type { IVolunteer } from "../../../database/volunteerSchema";
import type {
  IVolunteerRole,
  IVolunteerRoleTimeslot,
} from "../../../database/volunteerRoleSchema";
import style from "./AdminEventDetails.module.css";
import {
  Box,
  Text,
  Heading,
  Flex,
} from "@chakra-ui/react";

type Props = {
  name: string;
  roles: IVolunteerRole[];
  responses: IFormAnswer[];
};

export default function DisplayVolunteerInformation({ name, roles, responses }: Props) {
  function parseDate(date: Date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  return (
    <Box>
      <Heading size="md" mb={4}>{name}</Heading>
      {roles.map((role, index) => (
        <Box key={index} mb={4}>
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
            <Flex 
              className={style.openTime}
              ml={4}>
              {role.timeslots.map((timeslot, subIndex) => (
                <Text key={subIndex} mb={1} fontSize="sm">
                  {parseDate(timeslot.startTime)} - {parseDate(timeslot.endTime)} {"\xa0"}
                  
                </Text>
                
              ))}
            </Flex>
          </Flex>

          {responses.map((response, index2) => (
            <Flex key={index2} align="center">
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
      ))}
    </Box>
  );
  
}
