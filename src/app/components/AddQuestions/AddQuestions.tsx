import React from 'react';
import type { IVolunteerForm } from '@database/volunteerFormSchema'; 

import { AddCircle } from '@mui/icons-material';
import Button from '@mui/material/Button';

export default function AddQuestions(props: IVolunteerForm) {
    return(

    <div>
            <Button variant="outlined" startIcon={<AddCircle />}>
            
            </Button>
    </div>
    );
}