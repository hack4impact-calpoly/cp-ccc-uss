import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { IEvent } from "@database/eventSchema";
import Link from "next/link";
import { useRef } from "react";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { EventInstance } from "@fullcalendar/core/internal";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import UserEventDetails from "./UserEventDetails";
import style from "../styles/Calendar.module.css";
import AdminEventDetails from "./AdminEventDetails/AdminEventDetails";

//Interface to define full calendar event format
interface FullCalendarEvent {
  id: string;
  title: string;
  start: Date;
}

const Calendar = ({ admin = false }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [fullCalendarEvents, setFullCalendarEvents] = useState<
    FullCalendarEvent[]
  >([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  //get all events on first render
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/event/");
        const eventsFromDB = await response.json();
        setEvents(eventsFromDB);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  //updates state varibales
  const handleEventClick = (info: EventClickArg) => {
    setSelectedEventId(info.event.id);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
  };

  // useEffect to convert events to FullCalendar compatible events whenever events array changes
  useEffect(() => {
    const convertEventsToFCFormat = () => {
      if (events !== null) {
        const FullCalendarEvents = events.map((event) => ({
          id: event._id,
          title: event.name,
          start: event.date, //start is the date field for the full calendar
        }));
        setFullCalendarEvents(FullCalendarEvents);
      }
    };

    convertEventsToFCFormat();
  }, [events]);

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        editable
        selectable
        initialView="dayGridMonth"
        events={fullCalendarEvents}
        eventClick={handleEventClick}
      />

      <Modal size="md" isOpen={detailModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent className={style.modal}>
          <ModalBody>
            {admin ? (
              <AdminEventDetails _id={selectedEventId} />
            ) : (
              <UserEventDetails id={selectedEventId} />
            )}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Calendar;
