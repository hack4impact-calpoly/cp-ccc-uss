import React, {useState, useEffect} from "react"
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import type { IEvent } from "@database/eventSchema";
import Link from 'next/link';
import { useRef } from "react";
import { EventInstance } from "@fullcalendar/common";

//Interface to define full calendar event format
interface FullCalendarEvent {
  id: string;
  title: string;
  start: Date;
}


const Calendar = ({admin = false}) => {
  const [events, setEvents] = useState <IEvent[] | null>(null);
  const [fullCalendarEvents, setFullCalendarEvents] = useState<FullCalendarEvent[]>([]);

  //get all events on first render
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/event/');
        const eventsFromDB = await response.json(); 
        setEvents(eventsFromDB);

      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  
  // useEffect to convert events to FullCalendar compatible events whenever events array changes
  useEffect(() => {
    const convertEventsToFCFormat = () => {
      if (events !== null){
        const FullCalendarEvents = events.map(event => ({
          id: event._id,
          title: event.name,
          start: event.date //start is the date field for the full calendar (I Think)
        }))
        setFullCalendarEvents(FullCalendarEvents);
      }
    }

    convertEventsToFCFormat();
  }, [events])

  const [selectedEventId, setSelectedEventId] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      editable
      selectable
      initialView='dayGridMonth'
      events = {fullCalendarEvents}

    //I didn't want to delete this testing code in case it was important
    //   events= {
    //     [
    //     { title: 'Test 1', allDay: false, date: '2024-01-25T08:33:33', url: "/test" },
    //     { title: 'Test 2', date: '2024-01-24T06:33:33' }
    //   ]
    // }
    />
  );
};

export default Calendar;