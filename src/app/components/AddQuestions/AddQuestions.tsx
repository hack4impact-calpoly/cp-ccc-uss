/*import React, {useState} from 'react';
import type { IVolunteerForm } from '@database/volunteerFormSchema'; 
import { IFormQuestion } from '@database/volunteerFormSchema'

//Three options
//
export default function AddQuestions(props: { questions: IFormQuestion[], setQuestions: Function }) {

    const [currentOption, setCurrentOption] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedQuestions = [...props.questions];
        updatedQuestions[index].question = e.target.value;
        props.setQuestions(updatedQuestions);

      };
    
    const handleFieldTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const updatedQuestions = [...props.questions];
        updatedQuestions[index].fieldType = e.target.value;
        props.setQuestions(updatedQuestions);
      };

      const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        currentOption[index] = e.target.value
        setCurrentOption(currentOption);
      }
    

      const handleAddOption = (index: number) => {
        const updatedQuestions = [...props.questions];
    
        if (updatedQuestions[index].fieldType === 'Multiple Choice') {
          updatedQuestions[index].options = [
            ...(updatedQuestions[index].options || []), 
            currentOption[index]
          ];
    
          props.setQuestions(updatedQuestions);
          currentOption[index] = ''
          setCurrentOption(currentOption)
        }
      }


    return(
    <div>
        {props.questions.map((question, index) => (

            <div key={index}>

                <input 
                    type="text" 
                    value={question.question}
                    placeholder="Enter Question"
                    onChange={(e) => handleInputChange(e, index)}
                />
                <select value={question.fieldType} onChange={(e) => handleFieldTypeChange(e, index)}>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Short Answer">Short Answer</option>
                </select>

                <div>
                    {question.fieldType == "Multiple Choice" ?         
                    <div>
                        <input
                            type="text"
                            value={currentOption[index]}
                            onChange={(e) => handleOptionChange(e, index)}
                            placeholder="Type an option..."
                        />
                            <button onClick={() => handleAddOption(index)}>
                                Add Option
                            </button>
                        
                        <ul>
                            {question.options?.map((option) => (
                            <li>
                                {option}
                            </li>
                            ))}
                        </ul>
                    </div> : <div><h1>Short Answer</h1></div>}

                </div>

            </div>
            ))}
    </div>
    );
}

*/
import React, {useState} from 'react';
import type { IVolunteerForm } from '@database/volunteerFormSchema'; 
import { IFormQuestion } from '@database/volunteerFormSchema'


export default function AddQuestions(props: { questions: IFormQuestion[], setQuestions: Function }) {

    const [currentOption, setCurrentOption] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedQuestions = [...props.questions];
        updatedQuestions[index].question = e.target.value;
        props.setQuestions(updatedQuestions);

      };
    
    const handleFieldTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const updatedQuestions = [...props.questions];
        updatedQuestions[index].fieldType = e.target.value;
        props.setQuestions(updatedQuestions);
      };

      const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentOption(e.target.value);
      }
    

      const handleAddOption = (index: number) => {
        const updatedQuestions = [...props.questions];
    
        if (updatedQuestions[index].fieldType === 'Multiple Choice') {
          updatedQuestions[index].options = [
            ...(updatedQuestions[index].options || []), 
            currentOption
          ];
    
          props.setQuestions(updatedQuestions);
          setCurrentOption('')
        }
      }


    return(
    <div>
        {props.questions.map((question, index) => (

            <div key={index}>

                <input 
                    type="text" 
                    value={question.question}
                    placeholder="Enter Question"
                    onChange={(e) => handleInputChange(e, index)}
                />
                <select value={question.fieldType} onChange={(e) => handleFieldTypeChange(e, index)}>
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Short Answer">Short Answer</option>
                </select>

                <div>
                    {question.fieldType == "Multiple Choice" ?         
                    <div>
                        <input
                            type="text"
                            id="OptionInput"
                            onChange={(e) => handleOptionChange(e)}
                            placeholder="Type an option..."
                        />
                            <button onClick={() => handleAddOption(index)}>
                                Add Option
                            </button>
                        
                        <ul>
                            {question.options?.map((option, opIndex) => (
                            <li key={opIndex}>
                                {option}
                            </li>
                            ))}
                        </ul>
                    </div> : <div><h1>Short Answer</h1></div>}

                </div>

            </div>
            ))}
            
    </div>
  );
}
