"use client";
import style from './AdminEventDetails.module.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SegmentIcon from '@mui/icons-material/Segment';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { useEffect, useState } from 'react';
import { IEvent } from '@database/eventSchema';

type Props = {
  _id: string ;
};
  
async function getEvent(_id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/event/${_id}`, { //default GET
      cache: "no-store", 
    } );

    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }
    console.log("Data: " + res.json)
    return res.json();
  } catch (err: unknown) {
    console.log(`error: ${err}`);
    return null;
  }
}

function getDayName(date: Date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const eventDay = new Date(date).getDay();
  const eventDayName = days[eventDay];
  return eventDayName;
}

function AdminEventDetailsButton() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <button onClick={handleClick}
    style={{ 
    background: 'transparent', 
    border: 'none', 
    textDecoration: 'underline', 
    color: 'black', 
    cursor: 'pointer',
    fontFamily: 'Avenir',
    fontSize: '16px',
  }}>
    more details 
    </button>;
}

export default function AdminEventDetails({ _id }: Props) {
  const [event, setEvent] = useState<IEvent | null>(null);

  const tempVolunteerRole = { //temporary volunteer role, once we have the volunteer data, we can remove this
    startTime: new Date("2024-02-26T08:00:00.000-08:00").toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    endTime: new Date("2024-02-26T08:00:00.000-09:00").toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    volunteers: ['volunteer1', 'volunteer2', 'volunteer3'],
  };
  
  useEffect(() => {
    const setEventData = async () => {
      try {
        const data = await getEvent(_id);
        setEvent(data);
      } catch (err) {
        console.error(err);
      }
    };

    setEventData()
  }, [_id])

  if (event) {
  return (
    <div className={style.adminEventDetails}>
      <div className={style.eventName}>{event.name}</div>
      <div className={style.eventDay}><AccessTimeIcon className={style.icon} sx={{fontSize: 32}}></AccessTimeIcon>{getDayName(event.date)}</div>
      <div className={style.eventLocation}><LocationOnOutlinedIcon className={style.icon} sx={{fontSize: 32}}></LocationOnOutlinedIcon>{event.location}</div>
      <div className={style.eventDescription}><SegmentIcon className={style.icon} sx={{fontSize: 32}}></SegmentIcon>{event.description}</div>
      <div className={style.headerContainer}>
        <div>
          <PeopleOutlineIcon className={style.icon} sx={{fontSize: 32}}></PeopleOutlineIcon>
          Volunteers
        </div>
        <AdminEventDetailsButton/>
      </div>
      <div className={style.eventRoles}>
        {event.roles.map((role: string) => (
        <div className={style.eventRole} key={role}>{role}</div>
        ))}
      </div>
      <div className={style.openVolunteerSlots}><ImportContactsIcon className={style.icon} sx={{fontSize: 32}}></ImportContactsIcon>Open Volunteer Slots</div>
      <div className={style.eventOpenSlots}>
        {event.roles.map((role: string) => (
        <div key={role}>
          <div>{role}</div>
          <div className={style.openDetails}>
            <div className={style.signedUp}>Volunteers Signed Up: {tempVolunteerRole.volunteers.length}</div>
            <div className={style.openTime}>{tempVolunteerRole.startTime} - {tempVolunteerRole.endTime}</div>
          </div>
        </div>
        ))}
      </div>
    </div>
    
  ) } else {
        return (
          <div>
            <h1>Loading...</h1>
          </div>
          )
      }
}