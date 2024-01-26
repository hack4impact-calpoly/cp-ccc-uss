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
      initialView='timeGridWeek'
      events={[
        { title: 'Test 1', allDay: false, date: '2024-01-25T08:33:33', url: "/test" },
        { title: 'event 2', date: '2019-04-02' }
      ]}
    />
  );
};

export default Calendar;