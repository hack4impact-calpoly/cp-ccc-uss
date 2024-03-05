import React, { useEffect, useState } from "react";
import { IFormQuestion } from "@database/volunteerFormSchema";
import { Box, Button, FormControl, IconButton, Input, List, ListItem, Select } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

//add to parent component
//const [questions, setQuestions] = useState<IFormQuestion[]>([])

//when adding component
//<AddQuestions questions={questions} setQuestions={setQuestions}/>

export default function AddQuestions(props: {
  questions: IFormQuestion[];
  setQuestions: Function;
}) {
  const [newOptionInputs, setNewOptionInputs] = useState<{
    [index: number]: string;
  }>({});

  useEffect(() => {
    console.log("Questions state changed:", props.questions);
  }, [props.questions]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedQuestions = [...props.questions];
    updatedQuestions[index].question = e.target.value;
    props.setQuestions(updatedQuestions);
  };

  const handleFieldTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const updatedQuestions = [...props.questions];
    updatedQuestions[index].fieldType = e.target.value;
    props.setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setNewOptionInputs({
      ...newOptionInputs,
      [index]: e.target.value,
    });
  };

  const handleOptionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    optionIndex: number
  ) => {
    const updatedQuestions = [...props.questions];
    const question = updatedQuestions[questionIndex];

    if (question.options) {
      question.options[optionIndex] = e.target.value;
      props.setQuestions(updatedQuestions);
    } else {
      console.error("Options are undefined");
    }
  };

  const handleAddOption = (index: number) => {
    const updatedQuestions = [...props.questions];
    const newOption = newOptionInputs[index] || "";

    if (updatedQuestions[index].fieldType === "MULTI_SELECT" && newOption) {
      updatedQuestions[index].options = [
        ...(updatedQuestions[index].options || []),
        newOption,
      ];

      setNewOptionInputs({
        ...newOptionInputs,
        [index]: "",
      });

      props.setQuestions(updatedQuestions);
    }
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...props.questions];
    const question = updatedQuestions[questionIndex];

    if (question.options) {
      //splice here removes the option from the array at index optionIndex
      question.options.splice(optionIndex, 1);
      props.setQuestions(updatedQuestions);
    } else {
      console.error("Options are undefined");
    }
  };

  const addQuestion = () => {
    const emptyQuestion: IFormQuestion = {
      question: "",
      fieldType: "MULTI_SELECT",
      options: [],
    };
    props.setQuestions((prevQuestions: any) => [
      ...prevQuestions,
      emptyQuestion,
    ]);
  };

  return (
    <Box>
      {props.questions.map((question, index) => (
        <Box key={index}>
          <FormControl>
            <Input
              type="text"
              value={question.question}
              placeholder="Enter Question"
              onChange={(e) => handleInputChange(e, index)}
            />
            <Select
              value={question.fieldType}
              onChange={(e) => handleFieldTypeChange(e, index)}
            >
              <option value="MULTI_SELECT">Multiple Choice</option>
              <option value="SHORT_ANSWER">Short Answer</option>
            </Select>
          </FormControl>

          <Box>
            {question.fieldType === "MULTI_SELECT" && (
              <Box>
                <List>
                  {question.options?.map((option, opIndex) => (
                    <ListItem key={opIndex}>
                      <Input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionInputChange(e, index, opIndex)
                        }
                      />
                      <IconButton
                        aria-label="Delete option"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteOption(index, opIndex)}
                      />
                    </ListItem>
                  ))}
                  <ListItem>
                    <Input
                      type="text"
                      value={newOptionInputs[index] || ""}
                      onChange={(e) => handleOptionChange(e, index)}
                      placeholder="Type an option..."
                    />
                    <Button onClick={() => handleAddOption(index)}>
                      Add Option
                    </Button>
                  </ListItem>
                </List>
              </Box>
            )}
          </Box>
        </Box>
      ))}
      <Button onClick={addQuestion}>Add Question</Button>
    </Box>
  );
}
