import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { IEvent } from "@database/eventSchema";
import style from "@styles/calendar.module.css";
import { useDisclosure } from "@chakra-ui/react";
import { EventClickArg } from "@fullcalendar/core/index.js";
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
import AdminEventDetails from "./AdminEventDetails/AdminEventDetails";
import CreateEvent from "./CreateEvent/CreateEvent";
import { useUser } from '@clerk/nextjs';
import Link from "next/link";

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

  //User Session Data
  const { isLoaded, isSignedIn, user } = useUser();
  const admins = process.env.NEXT_PUBLIC_ADMIN_EMAIL_ADDRESSES?.split(",");
  if (user && isSignedIn && isLoaded && user.primaryEmailAddress) {
    if (admins?.includes(user.primaryEmailAddress.emailAddress)) {
      admin = true;
    } 
  }


  //for event modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);

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
      <div className={style.wrapper}>
        <style>{calendarStyles}</style>
        <>
        <div className={style.buttonContainer}>
          {admin ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button mt={3} colorScheme="teal">
              <Link href="/admin/profiles">Profile Database</Link>
            </Button>
            <Button mt={3} ref={btnRef} onClick={onOpen} colorScheme="teal">
              Add Event
            </Button>
          </div>) : null}
        </div>
        <Modal
          onClose={onClose}
          finalFocusRef={btnRef}
          isOpen={isOpen}
          scrollBehavior={"inside"}
          size={"xl"}
        >
          <ModalOverlay />
          <ModalContent>
            <div>
              <ModalCloseButton />

              <CreateEvent 
                events={events} 
                setEvents={setEvents} 
                onOpen={onOpen}
                onClose={onClose}/>
            </div>
          </ModalContent>
        </Modal>
      </>
      <FullCalendar
        aspectRatio={style ? 1.5 : 2.0}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        titleFormat={{ month: "long" }}
        dayHeaderFormat={{ weekday: "long" }}
        editable
        selectable
        initialView="dayGridMonth"
        events={fullCalendarEvents}
        eventClick={handleEventClick}
      />

      <Modal size="2xl" isOpen={detailModalOpen} onClose={handleCloseModal}>
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
    </div>
  );
};

const calendarStyles = `
.fc .fc-prev-button, .fc .fc-next-button {
  background-color: #bfbdbd;
  border: none;
  color: #FFF;
  font-size: 2em;
  font-size: .5em;
  border-radius: 50%; 
  line-height: 1;
}

.fc .fc-toolbar {
  align-items: center;
  display: flex;
  justify-content: center;
}

.fc-toolbar-chunk {
  padding-right: 2%;
}

.fc-toolbar-title {
  font-family: sans-serif;
}

.fc .fc-event {
  background-color: #C4F1DE;
  border-radius: 1em;
  padding: 5%;
  padding-right: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-family: Sans-serif;

  .fc-event-title {
    font-weight: normal;
  }
}

.fc-daygrid-event-dot {
  display: none;
}

.fc-event-time {
  display: none;
}

.fc-daygrid-day-top {
  justify-content: left;
  .fc-daygrid-day-number {
    font-family: Sans-serif;
  }
}

.fc-col-header-cell-cushion {
  font-family: Sans-serif;
  font-weight: normal; 
}

.fc-col-header   {
  background-color: #ffb94f;
  border-radius: 1em;
  font-family: Sans-serif;
}

.fc-col-header-cell {
  border-style: none;
}

.fc-day {
  border-radius: 1em;
}

`;

export default Calendar;
