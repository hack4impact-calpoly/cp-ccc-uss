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
  volunteerId: string;
  name: string;
  role: IVolunteerRole;
  timeslot: IVolunteerRoleTimeslot;
  responses: IFormAnswer[];
};

export default function VolunteerDetails({ _id }: Props) {
  const [volunteerEntries, setVolunteerEntries] = useState<VolunteerEntry[]>(
    []
  );
  const [searchItem, setSearchItem] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
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
              {volunteerEntries.map((entry) => (
                <li key={entry.volunteerId}>
                  <DisplayVolunteerInformation
                    name={entry.name}
                    role={entry.role}
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
