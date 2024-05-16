"use client";
import style from './AdminEventDetails.module.css';
import { useEffect, useState } from 'react';
import { IEvent } from '@database/eventSchema';
import { IVolunteerRole } from '@database/volunteerRoleSchema';
import { IVolunteerRoleTimeslot } from '@database/volunteerRoleSchema';
import { Icon, Button, IconButton, useToast } from '@chakra-ui/react'
import { LuCalendarDays, LuText, LuUsers, LuBookOpen } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'
import EditEvent from '@components/EditEvent';
import React from 'react';

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

// delete event by id
async function handleDeleteEvent(_id: string, toast: any) {
  try {
    const res = await fetch(`http://localhost:3000/api/event/${_id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete event');
    }

    const data = await res.json();

    console.log(data);
    toast({
      title: 'Event deleted.',
      description: 'The event has been deleted successfully.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
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
        fontFamily: "sans-serif",
        fontSize: "20px",
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
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // for edit modal
  const cancelRef = React.useRef()

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
            onClick={onOpen}
          />
          <Modal
            onClose={onClose}
            // finalFocusRef={btnRef}
            isOpen={isOpen}
            scrollBehavior={"inside"}
            size={"xl"}
          >
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <EditEvent
                  events={[event]}
                  setEvents={setEvent}
                  setRoles={setRoles}
                  onClose={onClose}
                />
                {/* content here */}
            </ModalContent>
          </Modal>
        <>
          <IconButton
          variant='outline'
          colorScheme='teal'
          aria-label='Delete event'
          icon={<DeleteIcon />}
          onClick={onOpen}
          />     
          <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Delete Customer
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='red' onClick={() => handleDeleteEvent(_id, toast)} ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>  
        </> 
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
          <div style={{marginTop: "10px", overflow: 'scroll', maxHeight: '400px'}}>
            <strong>Description:{" "}</strong>
            {" " +event.description}
          </div>
        </div>
        <div className={style.volunteersHeaderContainer}>
          <div style={{display: "flex", alignItems: "center"}}>
            <Icon as={LuUsers}
              className={style.icon}
              sx={{ fontSize: 50 }}/>
            <div style={{marginTop: "6px"}}><strong>Volunteers</strong></div>
          </div>
          <div style={{marginTop: "6px"}}><AdminEventDetailsButton /></div>
        </div>
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