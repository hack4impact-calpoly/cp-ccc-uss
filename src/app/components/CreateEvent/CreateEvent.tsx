import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import IconButton from '@mui/material/IconButton';
import { AddCircle } from '@mui/icons-material';
import Button from '@mui/material/Button';

function CreateEvent() {
    const[eventName, setEventName] = useState('')
    const[date, setDate] = useState('')
    const[startTime, setStartTime] = useState('')
    const[endTime, setEndTime] = useState('')
    const[description, setDescription] = useState('')
    const[questions, setQuestions] = useState('')
    
    const handleChangeName = (e: any) => {
        setEventName(e)
    }

    const handleChangeStart = (e: any) => {
        setStartTime(e)
    }

    const handleChangeEnd = (e: any) => {
        setEndTime(e)
    }

    const handleChangeDescript = (e: any) => {
        setDescription(e)
    }

    //post request for all the event data 

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
            <DatePicker/>
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
            </div>
        </div>
    )


}

export default CreateEvent;