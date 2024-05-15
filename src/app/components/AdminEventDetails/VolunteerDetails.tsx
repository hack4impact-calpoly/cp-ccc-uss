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
  _id: string;
  eventId: string;
  roles: IVolunteerRole[];
  volunteer: IVolunteer;
  responses: IFormAnswer[];
};

export default function VolunteerDetails({ _id }: Props) {
  const [volunteerEntries, setVolunteerEntries] = useState<VolunteerEntry[]>(
    []
  );
  const [searchItem, setSearchItem] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filteredEntries, setFilteredEntries] = useState<VolunteerEntry[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState(null);

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

    console.log(searchTerm);

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

    console.log(filteredItems);

    setFilteredEntries(filteredItems);
  };

  async function fetchEntries() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/event/${_id}/entry`
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
    <div>
      <button
        onClick={onOpen}
        style={{
          background: "transparent",
          border: "none",
          textDecoration: "underline",
          color: "#00aa9e",
          cursor: "pointer",
          fontFamily: "sans-serif",
          fontSize: "20px",
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
            {loading && <p>Loading...</p>}
            {error && <p>There was an error loading the volunteer details.</p>}
            {!loading && !error && filteredEntries.length === 0 ? (
              <p>No volunteers found.</p>
            ) : (
              <ul>
                {filteredEntries.map((entry, Index) => (
                  <li key={Index}>
                    <DisplayVolunteerInformation
                      name={entry.volunteer.name}
                      roles={entry.roles}
                      responses={entry.responses}
                    />
                  </li>
                ))}
              </ul>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
