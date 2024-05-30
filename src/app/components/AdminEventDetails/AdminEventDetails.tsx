"use client";
import style from './AdminEventDetails.module.css';
import { useEffect, useState } from 'react';
import { IEvent } from '@database/eventSchema';
import { IVolunteerRole } from '@database/volunteerRoleSchema';
import { IVolunteerRoleTimeslot } from '@database/volunteerRoleSchema';
import VolunteerDetails from "./VolunteerDetails";
import { LuCalendarDays, LuText, LuUsers, LuBookOpen } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Modal,
  Button, 
  Icon, 
  IconButton, 
  useToast, 
  Flex,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";

import EditEvent from '@components/EditEvent';

type Props = {
  _id: string;
  updateEventInList: (updatedEvent: IEvent) => void;
  removeEventFromList: (deletedEventId: string) => void;
  onClose: () => void;
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

// delete event by id
async function handleDeleteEvent(_id: string, toast: any, removeEventFromList: (deletedEventId: string) => void, onClose: () => void) {
  const confirmed = window.confirm('Are you sure you want to delete this event?');

  if (!confirmed) {
    return; 
  }

  try {
    const res = await fetch(`http://localhost:3000/api/event/${_id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete event');
    }

    const data = await res.json();

    toast({
      title: 'Event deleted.',
      description: 'The event has been deleted successfully.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
    removeEventFromList(_id);
    onClose();
  } catch (err: unknown) {
    console.error('Error deleting event:', err);
    toast({
      title: 'Error deleting event',
      description: 'An error occurred while deleting the event',
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
  }
}

function parseDate(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminEventDetails({ _id, updateEventInList, removeEventFromList, onClose}: Props) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [roles, setRoles] = useState<IVolunteerRole[]>([]);
  const [error, setError] = useState(false);
  const toast = useToast();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose
  } = useDisclosure();
  
  const {
    isOpen: isVolunteerModalOpen,
    onOpen: onVolunteerModalOpen,
    onClose: onVolunteerModalClose
  } = useDisclosure();

  const onEventUpdated = (updatedEvent: IEvent) => {
    console.log("Updating event in parent:", updatedEvent);
    setEvent(updatedEvent);
    updateEventInList(updatedEvent);
  };

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
        <div className={style.editAndDelete}>
          <IconButton
            variant='outline'
            colorScheme='teal'
            aria-label='Edit event'
            icon={<EditIcon/>}
            onClick={onEditModalOpen}
          />
          <Modal
            onClose={onEditModalClose}
            isOpen={isEditModalOpen}
            scrollBehavior={"inside"}
            size={"xl"}
          >
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                {event && (<EditEvent
                  event={event}
                  onEventUpdated={onEventUpdated}
                  onClose={onEditModalClose}
                  eventId={_id}
                />
                )}
            </ModalContent>
          </Modal>
          <IconButton
            variant='outline'
            colorScheme='teal'
            aria-label='Delete event'
            icon={<DeleteIcon />}
            onClick={() => handleDeleteEvent(_id, toast, removeEventFromList, onClose)}
            />        
        </div>
        <div className={style.eventHeader}>Event Details: Admin</div>
        <div className={style.eventName}>{event.name}</div>
        <div className={style.eventDay} >
          <Icon as={LuCalendarDays}
            className={style.icon}
            sx={{ fontSize: 50 }}/>
          <div style={{marginTop: "10px"}}>
            <strong>Date:</strong>
            {" " + new Date(event.date).toDateString()}
          </div>
        </div>
        <div className={style.eventLocation}>
          <Icon as={IoLocationOutline}
            className={style.icon}
            sx={{ fontSize: 50 }}/>
          <div style={{marginTop: "10px"}}>
            <strong>Location:</strong>
            {" " + event.location}
          </div>
        </div>
        <div className={style.eventDescription}>
          <Icon as={LuText}
            className={style.icon}
            sx={{ fontSize: 50 }}/>
          <div style={{marginTop: "10px"}}>
            <strong>Description:{" "}</strong>
            {" " +event.description}
          </div>
        </div>
        <div className={style.volunteersHeaderContainer}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
            
            <Flex alignItems="center">
              <Icon as={LuUsers}
                className={style.icon}
                sx={{ fontSize: 50 }}/>
                <div style={{marginTop: "6px"}}><strong>Volunteers</strong></div>
            </Flex>
            <Button
                      onClick={onVolunteerModalOpen}
                      background="transparent"
                      border="none"
                      textDecoration="underline"
                      color="#00aa9e"
                      cursor="pointer"
                      fontFamily="sans-serif"
                      fontSize="15px"
                    >
                      more details
              </Button>

            
          </div>
        </div>
        <div style={{marginTop: "6px"}}><VolunteerDetails _id={event._id} isOpen={isVolunteerModalOpen} onOpen={onVolunteerModalOpen} onClose={onVolunteerModalClose} /></div>

        {/* Later implement all volunteers for an event here */}
        <div className={style.eventRoles}></div>
        <div className={style.openVolunteerSlots}>
          <Icon as={LuBookOpen}
            className={style.icon}
            sx={{ fontSize: 50 }}/>
          <strong>Open Volunteer Slots</strong>
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
                        {parseDate(timeslot.startTime)} - {" "}
                        {parseDate(timeslot.endTime)} | Volunteers Signed Up: {" "}
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