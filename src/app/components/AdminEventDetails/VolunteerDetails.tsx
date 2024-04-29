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
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import DisplayVolunteerInformation from "./DisplayVolunteerInformation";

type Props = {
  _id: string;
};

type VolunteerEntry = {
  name: string;
  roles: IVolunteerRole[];
  timeslot: IVolunteerRoleTimeslot;
  responses: IFormAnswer[];
};

export default function VolunteerDetails({ _id }: Props) {
  const [volunteerEntries, setVolunteerEntries] = useState<VolunteerEntry[]>(
    []
  );
  const [searchItem, setSearchItem] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredEntries, setFilteredEntries] = useState<VolunteerEntry[]>([]);

  function parseDate(date: Date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filteredItems = volunteerEntries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.roles.map((role: IVolunteerRole) =>
          role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        parseDate(entry.timeslot.startTime)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        parseDate(entry.timeslot.endTime)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        entry.responses.map(
          (resp: IFormAnswer) =>
            resp.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resp.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    setFilteredEntries(filteredItems);
  };

  async function fetchEntries() {
    try {
      const response = await fetch(`http://localhost:3000/api/entry`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch volunteer entries. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setVolunteerEntries(data);
      setFilteredEntries(data);
    } catch (err: unknown) {
      console.error("Error:", err);
      setVolunteerEntries([]);
    }
  }

  return (
    <div>
      <button
        onClick={onOpen}
        style={{
          background: "transparent",
          border: "none",
          textDecoration: "underline",
          color: "black",
          cursor: "pointer",
          fontFamily: "Avenir",
          fontSize: "16px",
        }}
      >
        more details
      </button>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Volunteer Details</ModalHeader>
          <ModalBody>
            <input
              type="text"
              value={searchItem}
              onChange={handleSearchChange}
              placeholder="Type to search"
            />
            <ul>
              {filteredEntries.map((entry, Index) => (
                <li key={Index}>
                  <DisplayVolunteerInformation
                    name={entry.name}
                    roles={entry.roles}
                    timeslot={entry.timeslot}
                    responses={entry.responses}
                  />
                </li>
              ))}
            </ul>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
