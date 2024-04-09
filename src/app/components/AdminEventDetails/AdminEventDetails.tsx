"use client";
import style from './AdminEventDetails.module.css';
import { useEffect, useState } from 'react';
import { IEvent } from '@database/eventSchema';
import { IVolunteerRole } from '@database/volunteerRoleSchema';
import { IVolunteerRoleTimeslot } from '@database/volunteerRoleSchema';
import { Icon } from '@chakra-ui/react'
import { LuCalendarDays, LuText, LuUsers, LuBookOpen } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";



type Props = {
  _id: string ;
};

// get event by id
async function getEvent(_id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/event/${_id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

// get all roles for specified event
async function getRoles(_id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/event/${_id}/role`, {
      //default GET
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

function getDayName(date: Date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const eventDay = new Date(date).getDay();
  const eventDayName = days[eventDay];
  return eventDayName;
}

function parseDate(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function AdminEventDetailsButton() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: "transparent",
        border: "none",
        textDecoration: "underline",
        color: "#00aa9e",
        cursor: "pointer",
        fontFamily: "Avenir",
        fontSize: "16px",
      }}
    >
      more details
    </button>
  );
}

export default function AdminEventDetails({ _id }: Props) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [roles, setRoles] = useState<IVolunteerRole[]>([]);
  const [error, setError] = useState(false);

  //fetch event, then roles for that event
  useEffect(() => {
    const setEventData = async () => {
      try {
        const data = await getEvent(_id);
        const roles = await getRoles(_id);
        if (roles && data) {
          setEvent(data);
          setRoles(roles);
        } else {
          setError(true);
          console.error("failed to fetch data");
        }
      } catch (err) {
        console.error(err);
      }
    };

    setEventData();
  }, [_id]);

  if (event && roles) {
    return (
      <div className={style.adminEventDetails}>
        <div className={style.eventHeader}>Event Details: Admin</div>
        <div className={style.eventName}>{event.name}</div>
        <div className={style.eventDay} >
          <Icon as={LuCalendarDays}
            className={style.icon}
            sx={{ fontSize: 50 }}/>
          <div className={style.sectionContent} style={{marginTop: "6px"}}>
            <strong>Date:</strong>
            {" " + getDayName(event.date)}
          </div>
        </div>
        <div className={style.eventLocation}>
          <Icon as={IoLocationOutline}
            className={style.icon}
            sx={{ fontSize: 50 }}/>
          <div style={{marginTop: "6px"}}>
            <strong>Location:</strong>
            {" " + event.location}
          </div>
        </div>
        <div className={style.eventDescription}>
          <Icon as={LuText}
            className={style.icon}
            sx={{ fontSize: 50 }}/>
          <div style={{marginTop: "6px"}}>
            <strong>Description:{" "}</strong>
            {" " +event.description}
          </div>
        </div>
        <div className={style.volunteersHeaderContainer}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Icon as={LuUsers}
              className={style.icon}
              sx={{ fontSize: 50 }}/>
            <div style={{marginTop: "6px"}}>Volunteers</div>
          </div>
          <div style={{marginTop: "6px"}}><AdminEventDetailsButton /></div>
        </div>
        {/* Later implement all volunteers for an event here */}
        <div className={style.eventRoles}></div>
        <div className={style.openVolunteerSlots}>
          <Icon as={LuBookOpen}
            className={style.icon}
            sx={{ fontSize: 50 }}/>
          Open Volunteer Slots
        </div>
        <div className={style.eventOpenSlots}>
          {/* Lists all roles for an event with corresponding timeslots */}
          {roles.map((role: IVolunteerRole, Index) => (
            <div key={Index}>
              <div>{role.roleName}</div>
              <div className={style.openDetails}>
                {role.timeslots.map(
                  (timeslot: IVolunteerRoleTimeslot, Index2) => (
                    <div key={Index2}>
                      <div className={style.openTime}>
                        {parseDate(timeslot.startTime)} -{" "}
                        {parseDate(timeslot.endTime)} | Volunteers Signed Up:{" "}
                        {timeslot.volunteers.length}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h1>Failed to fetch data :/</h1>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
}