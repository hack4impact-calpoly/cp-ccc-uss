import React from 'react';
import type { IVolunteerForm } from '@database/volunteerFormSchema'; 

import { AddCircle } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function AddQuestions(props: IVolunteerForm) {
    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value as string);
    };
    return(
    <div>
        <Button variant="outlined" startIcon={<AddCircle />}></Button>

        <Box sx={{ maxWidth: 200 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Question</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
                >
                <MenuItem value={"Short Answer"}>Short Answer</MenuItem>
                <MenuItem value={"Multiple Choice"}>Multiple Choice</MenuItem>

                </Select>
            </FormControl>
        </Box>
    </div>
    );
}