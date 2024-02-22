import React, {useState} from 'react';
import type { IVolunteerForm } from '@database/volunteerFormSchema'; 

import { AddCircle } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';



export default function AddQuestions(props: IVolunteerForm) {
    const [inputValue, setInputValue] = useState('');
    const [fieldType, setFieldType] = useState('Multiple Choice');
    const [options, setOptions] = useState<string[]>([]);
    const [currentOption, setCurrentOption] = useState('');
    const [finalized, setFinalized] = useState(false);
    const [clickableOption, setClickableOption] = useState('');



    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInputValue(e.target.value);
      };
      
    const handleOptionChange = (e: { target: { value: any; }; }) => {
    setCurrentOption(e.target.value);
    };    

    const handleFieldTypeChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setFieldType(e.target.value);
      };
      
    const handleAddOption = () => {

        setOptions((options) => [...options, currentOption]);
        setCurrentOption('');
    
    };

    const handleCircleClick = () => {
        if (finalized) {

        setOptions((options) => [...options, clickableOption]);
        setCurrentOption('');

        }
    }
    
    return(
    <div>
         {//<Button variant="outlined" startIcon={<AddCircle />}></Button>
            }

        <input 
            type="text" 
            value={inputValue}
            placeholder="Enter Question"
            onChange={handleChange}
        />
        <select value={fieldType} onChange={handleFieldTypeChange}>
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="Short Answer">Short Answer</option>
        </select>

        <div>
            {fieldType == "Multiple Choice" ?         
            <div>
                <input
                    type="text"
                    value={currentOption}
                    onChange={handleOptionChange}
                    placeholder="Type an option..."
                />
                <button onClick={handleAddOption}>Add Option</button>
                <ul>
                    {options.map((option, index) => (
                    <li key={index}>
                        {option}
                        {//maybe check if finalized and if it is then we can add clickable circles
                        }
                    </li>
                    ))}
                </ul>
            </div> : <div><h1>Short Answer</h1></div>}


        </div>
    </div>
    );
}