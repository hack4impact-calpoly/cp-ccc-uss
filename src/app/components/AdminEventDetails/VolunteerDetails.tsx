import React, { useState, useEffect } from "react";
import type { IEvent } from "../../../database/eventSchema";
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
  Modal,
  ModalOverlay,
  UseDisclosureReturn,
  ModalContent,
  ModalHeader,
  ModalBody,
  Box,
  Button,
  Input,
  Text,
  List,
  ListItem,
  Heading,
  Flex,
  Avatar
} from "@chakra-ui/react";
import DisplayVolunteerInformation from "./DisplayVolunteerInformation";
import { useUser } from "@clerk/nextjs";

type Props = {
  _id: string;
  isOpen: UseDisclosureReturn["isOpen"];
  onOpen: UseDisclosureReturn["onOpen"];
  onClose: UseDisclosureReturn["onClose"];
}

type VolunteerEntry = {
  _id: string;
  eventId: string;
  roles: IVolunteerRole[];
  volunteer: IVolunteer;
  responses: IFormAnswer[];
};



export default function VolunteerDetails({ _id, isOpen, onOpen, onClose}: Props) {
  const [volunteerEntries, setVolunteerEntries] = useState<VolunteerEntry[]>(
    []
  );
  const [searchItem, setSearchItem] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState<VolunteerEntry[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  function parseDate(date: Date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = volunteerEntries.filter(
      (entry) =>
        entry.volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) //||
        // entry.roles.map((role: IVolunteerRole) =>
        //   role.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
        // )
      // ||
      // entry.responses?.map(
      //   (resp: IFormAnswer) =>
      //     resp.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //     resp.answer?.toLowerCase().includes(searchTerm.toLowerCase())
      // )
    );

    setFilteredEntries(filteredItems);
  };

  async function fetchEntries() {
    try {
      const response = await fetch(
        `/api/event/${_id}/entry`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch volunteer entries. Status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (err: unknown) {
      console.error("Error:", err);
      setVolunteerEntries([]);
      setFilteredEntries([]);
    }
  }

  useEffect(() => {
    fetchEntries()
      .then((data) => {
        setVolunteerEntries(data);
        setFilteredEntries(data);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box p={4}> 
      <Box>
        {!loading && !error && filteredEntries.length === 0 ? (
          <Text>No volunteers found.</Text>
        ) : (
          <List spacing={4}>
            {volunteerEntries.map((entry, index) => (
              <ListItem key={index}>
                <Flex direction="row">
                  <Avatar
                    name={entry.volunteer.name}
                    marginRight={3}
                    size="sm"
                  />
                  <Box>
                    <Heading fontSize="20px">{entry.volunteer.name}</Heading>
                    {entry.roles.map((role, roleIndex) => (
                      <Flex align="center" key={roleIndex}>
                        <Heading as="i" fontSize="sm">
                          {role.roleName} -
                        </Heading>
                        <Flex 
                          className={style.openTime}
                          ml={1}
                          direction="row">
                          {role.timeslots
                            .filter(timeslot => timeslot.volunteers.includes(entry.volunteer._id))
                            .map((timeslot, subIndex) => (
                              <Text key={subIndex} fontSize="sm">
                                {parseDate(timeslot.startTime)} - {parseDate(timeslot.endTime)} {"\xa0"}
                              </Text> 
                          ))}
                        </Flex>
                      </Flex>
                    ))}
                  </Box>
                </Flex>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Volunteer Details</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              value={searchItem}
              onChange={handleSearchChange}
              placeholder="Type to search"
              mb={4}
            />
            {loading && <Text>Loading...</Text>}
            {error && <Text>There was an error loading the volunteer details.</Text>}
            {!loading && !error && filteredEntries.length === 0 ? (
              <Text>No volunteers found.</Text>
            ) : (
              <List spacing={3}>
                {filteredEntries.map((entry, Index) => (
                  <ListItem key={Index}>
                    <Box>
                      <DisplayVolunteerInformation
                        name={entry.volunteer.name}
                        roles={entry.roles}
                        responses={entry.responses}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
