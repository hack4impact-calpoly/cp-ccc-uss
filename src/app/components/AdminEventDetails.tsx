import style from './AdminEventDetails.module.css';
import AdminEventDetailsButton from './AdminEventDetailsButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SegmentIcon from '@mui/icons-material/Segment';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

type Props = {
  params: { _id: string };
};
  
  async function getEvent(_id: string) {
    try {
      console.log("ID: " + _id)
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

  function getDayName(date: string) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const eventDay = new Date(date).getDay();
    const eventDayName = days[eventDay];
    return eventDayName;
  }

  export default async function AdminEventDetails({ params }: Props) {
    const event = await getEvent(params._id);
    const eventDayName = getDayName(event.date); 

    const tempVolunteerRole = { //temporary volunteer role, once we have the volunteer data, we can remove this
      startTime: new Date("2024-02-26T08:00:00.000-08:00").toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      endTime: new Date("2024-02-26T08:00:00.000-09:00").toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      volunteers: ['volunteer1', 'volunteer2', 'volunteer3'],
    };
    

    if (event) {
    return (
      <div className={style.adminEventDetails}>
        <div className={style.eventName}>{event.name}</div>
        <div className={style.eventDay}><AccessTimeIcon className={style.icon} sx={{fontSize: 32}}></AccessTimeIcon>{eventDayName}</div>
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
          {event.roles.map((role: string, index: number) => ( //currently only displays roles change map func to display volunteers later
          <div className={style.eventRole} key={index}>{role}</div>
          ))}
        </div>
        <div className={style.openVolunteerSlots}><ImportContactsIcon className={style.icon} sx={{fontSize: 32}}></ImportContactsIcon>Open Volunteer Slots</div>
        <div className={style.eventOpenSlots}>
          {event.roles.map((role: string, index: number) => ( //currently only displays roles change map func to display volunteers later
          <div>
            <div key={index}>{role}</div>
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
              <h1>Event not found</h1>
            </div>
            )
        }
  }