import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from '@fullcalendar/daygrid';
import Link from 'next/link';
import { useRef } from "react";
import { EventInstance } from "@fullcalendar/common";

const Calendar = () => {
  /*const calendarRef = useRef(null);*/
  return (
    <FullCalendar
      /*innerRef={calendarRef}*/
      /*schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'*/
      plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
      editable
      selectable
      initialView='dayGridMonth'
      events= {[
        { title: 'Test 1', allDay: false, date: '2024-01-25T08:33:33', url: "/test" },
        { title: 'Test 2', date: '2024-01-24T06:33:33' }
      ]}
    />
  );
};

export default Calendar;