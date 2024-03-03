import React, {useState} from 'react';
import type { IVolunteerForm } from '@database/volunteerFormSchema'; 

import { AddCircle } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import questions from '../../page';
import styles from "./AddQuestions.module.css"
import { IFormQuestion } from '@database/volunteerFormSchema'


export default function AddQuestions(props: { questions: IFormQuestion[]; }) {

    const questionList = props.questions;

    const [inputValue, setInputValue] = useState('');
    const [fieldType, setFieldType] = useState('Multiple Choice');
    const [options, setOptions] = useState<string[]>([]);
    const [currentOption, setCurrentOption] = useState('');

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



    return(
    <div>
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
                    </li>
                    ))}
                </ul>
            </div> : <div><h1>Short Answer</h1></div>}
        </div>
    </div>
    );
}