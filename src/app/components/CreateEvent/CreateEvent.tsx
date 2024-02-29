import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Dayjs } from 'dayjs';
import styles from './CreateEvent.module.css'
import { Input } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'

function CreateEvent() {
    const[eventName, setEventName] = useState('')
    const[date, setDate] = React.useState<Dayjs | null>(null);
    const[startTime, setStartTime] = useState('')
    const[endTime, setEndTime] = useState('')
    const[description, setDescription] = useState('')
    const[questions, setQuestions] = useState('')
    const[roles, setRoles] = useState(['default role'])
    const[form, setForm] = useState('default form')
    const[location, setLocation] = useState('default location')
    
    const handleChangeName = (e: any) => {
        setEventName(e.target.value)
    }

    const handleChangeStart = (e: any) => {
        setStartTime(e.target.value)
    }

    const handleChangeEnd = (e: any) => {
        setEndTime(e.target.value)
    }

    const handleChangeDescript = (e: any) => {
        setDescription(e.target.value)
    }

    const handleChangeDate = (e: any) => {
        setDate(e.target.value)
        console.log(e)
    }

    //post request for all the event data 
    const handleSubmit = async () => {
        try {
            console.log('Event Name:', eventName);
            console.log('Start:', startTime);
            console.log('End:', endTime);
            console.log('Date:', date);
            console.log('Roles:', roles);
            console.log('Description:', description);
            console.log('Location:', location);
            console.log('Form:', form);
          const response = await fetch('/api/event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: eventName,
              date: date,
              roles: roles,
              description: description,
              location: location,
              form: form,
            }),
          });
      
          if (response.ok) {
            const createdEvent = await response.json();
            console.log(createdEvent);
          } else {
            const err = await response.text();
            console.error('Error creating event:', err);
          }
        } catch (err) {
          console.error('Error creating event:', err);
        }
      };

    return (
        <div /* class={styles.event-container}*/>
            <Heading as='h3' size='lg'>
                Create Event
            </Heading>
            <div>
                <Input 
                    placeholder='Event Name'
                    onChange={handleChangeName}
                 />
            </div>
            <Input
            placeholder="Select Date and Time"
            size="md"
            type="date"
            onChange={handleChangeDate}/>
            {/* <div>
                <Input 
                    placeholder='Start Time'
                    onChange={handleChangeStart}
                 />
                <Input 
                    placeholder='End Time'
                    onChange={handleChangeStart}
                 />
            </div> */}
            <div>
                 <Textarea 
                    placeholder='Event Description'
                    onChange={handleChangeDescript}
                />
            </div>
            <div>
            <Button colorScheme='teal'>
                    Add Question
            </Button>
            <Button colorScheme='teal' onClick={handleSubmit}>
                    Create Event 
            </Button>
            </div>
        </div>
    )


}

export default CreateEvent;