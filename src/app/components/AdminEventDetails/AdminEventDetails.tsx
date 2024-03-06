"use client";
import style from './AdminEventDetails.module.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SegmentIcon from '@mui/icons-material/Segment';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { useEffect, useState } from 'react';
import { IEvent } from '@database/eventSchema';
import { IVolunteerRole } from '@database/volunteerRoleSchema';
import { IVolunteerRoleTimeslot } from '@database/volunteerRoleSchema';

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

async function getRoles(_id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/event/${_id}/role`, { //default GET
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

function parseDate(date: Date) {
  return (new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
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
  const [roles, setRoles] = useState<IVolunteerRole[]>([])

  //fetching data for respective use state vars
  useEffect(() => {
    const setEventData = async () => {
      try {
        const data = await getEvent(_id);
        setEvent(data);
        const roles = await getRoles(_id);
        setRoles(roles);
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
      {/* Later implement all volunteers for an event here */}
      <div className={style.eventRoles}>

      </div>
      <div className={style.openVolunteerSlots}><ImportContactsIcon className={style.icon} sx={{fontSize: 32}}></ImportContactsIcon>Open Volunteer Slots</div>
      <div className={style.eventOpenSlots}>
        {/* Lists all roles for an event with corresponding time frames */}
        {roles.map((role: IVolunteerRole, Index) => (
          <div key={Index}>
            <div>{role.roleName}</div>
            <div className={style.openDetails}>
              {role.timeslots.map((timeslot: IVolunteerRoleTimeslot, Index2) => (
                <div key={Index2}>
                  <div className={style.openTime}>{parseDate(timeslot.startTime)} - {parseDate(timeslot.endTime)} | Volunteers Signed Up: {timeslot.volunteers.length}</div>
                </div>
              ))}
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