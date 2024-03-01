import React, { useState, useEffect } from 'react'
import styles from './CreateEvent.module.css'
import { Input } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { IFormQuestion, IVolunteerForm } from '@database/volunteerFormSchema';
import { IVolunteerRole } from '@database/volunteerRoleSchema';

function CreateEvent() {
    const[eventName, setEventName] = useState('')
    const[date, setDate] = useState<Date | null>(null);
    const[description, setDescription] = useState('')
    const[questions, setQuestions] = useState<IFormQuestion[]>([])
    const[roles, setRoles] = useState<IVolunteerRole[]>([])
    const[location, setLocation] = useState('default location')
    
    const handleChangeName = (e: any) => {
        setEventName(e.target.value)
    }

    const handleChangeDesc = (e: any) => {
        setDescription(e.target.value)
    }

    const handleChangeDate = (e: any) => {
        setDate(e.target.value)
    }

    const handleSubmit = async () => {
        // POST each role

        // compile questions into VolunteerForm, POST form

        // POST event with role id's and form id
        try {
          const response = await fetch('/api/event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: eventName,
              date: date,
              roles: ['roleId1', 'roleId2'],
              description: description,
              location: location,
              form: "formId"
            }),
          });
      
          if (response.ok) {
            const createdEvent = await response.json();
          } else {
            const err = await response.text();
            console.error('Error creating event:', err);
          }
        } catch (err) {
          console.error('Error creating event:', err);
        }
      };

    return (
        <div className={styles.event}>
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
            <div>
                 <Textarea 
                    placeholder='Event Description'
                    onChange={handleChangeDesc}
                />
            </div>
            <div>
            <Button colorScheme='teal' onClick={handleSubmit}>
                    Create Event 
            </Button>
            </div>
        </div>
    )


}

export default CreateEvent;