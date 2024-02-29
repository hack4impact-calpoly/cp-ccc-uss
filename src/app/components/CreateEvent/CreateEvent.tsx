import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import IconButton from '@mui/material/IconButton';
import { AddCircle } from '@mui/icons-material';
import { CreateRounded } from '@mui/icons-material';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Dayjs } from 'dayjs';


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
        setDate(e)
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
        <div>
            <h1> Create Event</h1>
            <div>
                <TextField 
                    id="outlined-basic" 
                    label="Event Name"
                    variant="outlined" 
                    onChange={handleChangeName}
                />
            </div>
            <DatePicker 
                value={date} 
                onChange={handleChangeDate} />
            <div>
                <TextField 
                    id="outlined-basic" 
                    label="Start Time"
                    variant="outlined" 
                    onChange={handleChangeStart}
                />
                <TextField 
                    id="outlined-basic" 
                    label="End Time"
                    variant="outlined" 
                    onChange={handleChangeEnd}
                />
            </div>
            <div>
                <TextField 
                    id="outlined-basic" 
                    label="Event Description"
                    variant="outlined" 
                    onChange={handleChangeDescript}
                />
            </div>
            <div>
            <Button variant="outlined" startIcon={<AddCircle />}>
                Add Question
            </Button>
            <Button variant="outlined" startIcon={<CreateRounded />} onClick={handleSubmit}>
                Create Event
            </Button>
            </div>
        </div>
    )


}

export default CreateEvent;