import React, {useEffect, useState} from 'react';
import { IFormQuestion } from '@database/volunteerFormSchema'
import style from "./AddQuestions.module.css";

  //add to parent component
  //const [questions, setQuestions] = useState<IFormQuestion[]>([])
  
  //when adding component
  //<AddQuestions questions={questions} setQuestions={setQuestions}/>


export default function AddQuestions(props: { questions: IFormQuestion[], setQuestions: Function }) {

    const [currentOption, setCurrentOption] = useState('');
    useEffect(() => {
      console.log('Questions state changed:', props.questions);
  }, [props.questions]);

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

      const addQuestion = () => {
        // Create an empty question and append it to the questions array
        const emptyQuestion: IFormQuestion = {
          question: '',
          fieldType: 'Multiple Choice', // Set default fieldType or adjust as needed
          options: [],
        };
        props.setQuestions((prevQuestions: any) => [...prevQuestions, emptyQuestion]);
      };
    


    return(
    <div className={style.container}>
        {props.questions.map((question, index) => (

            <div key={index} className={style.question}>

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
                    </div> : <div></div>}

                </div>

            </div>
            ))}
            <button onClick={addQuestion}>add questions</button>  
    </div>
  );
}
