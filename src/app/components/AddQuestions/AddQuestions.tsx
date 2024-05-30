import React, { useEffect, useState } from "react";
import { IFormQuestion } from "@database/volunteerFormSchema";
import {
  Flex,
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  List,
  ListItem,
  Select,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { EmptyCircleIcon, PlusCircleIcon } from "../../styles/CustomElements";

export default function AddQuestions(props: {
  questions: IFormQuestion[];
  setQuestions: Function;
}) {
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

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...props.questions];
    updatedQuestions.splice(index, 1);
    props.setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex: number) => {
    const updatedQuestions = [...props.questions];
    updatedQuestions[questionIndex].options = [
      ...(updatedQuestions[questionIndex].options || []),
      "",
    ];
    props.setQuestions(updatedQuestions);
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
    props.setQuestions((prevQuestions: IFormQuestion[] | undefined) => {
      return [...(prevQuestions || []), emptyQuestion];
    });
  };
  
  if (!props.questions || props.questions.length === 0) {
    return (
      <Box maxWidth="463px" mx="auto" my={4}>
        <Button onClick={addQuestion} leftIcon={<PlusCircleIcon />} variant="unstyled">
          Add Question
        </Button>
      </Box>
    );
  }


  return (
    <Box maxWidth="463px" mx="auto">
      {props.questions.map((question, index) => (
        <Box key={index} mb={4}>
          <Flex align="center" mb={2}>
            <FormControl flex="1" mr="2">
              <Input
                type="text"
                value={question.question}
                placeholder="Enter Question"
                onChange={(e) => handleInputChange(e, index)}
                variant="unstyled"
                borderBottom="1px solid"
                borderRadius={0}
                borderColor="customGray"
                _placeholder={{ color: "placeholder" }}
                _focus={{ borderColor: "inputBorder" }}
              />
            </FormControl>
            <FormControl width="145px">
              <Select
                value={question.fieldType}
                onChange={(e) => handleFieldTypeChange(e, index)}
                borderColor="customGray"
                color="customGray"
                borderRadius="12px"
                fontSize={14}
                size="sm"
              >
                <option value="MULTI_SELECT">Multiple Choice</option>
                <option value="SHORT_ANSWER">Short Answer</option>
              </Select>
            </FormControl>
            <IconButton
              aria-label="Delete question"
              icon={<DeleteIcon />}
              onClick={() => handleDeleteQuestion(index)}
              variant="unstyled"
            />
          </Flex>

          <Box>
            {question.fieldType === "MULTI_SELECT" && (
              <Box>
                <List>
                  {question.options?.map((option, opIndex) => (
                    <ListItem key={opIndex} display="flex" alignItems="center">
                      <EmptyCircleIcon />
                      <Input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionInputChange(e, index, opIndex)
                        }
                        placeholder={`Option ${opIndex + 1}`}
                        flex="1"
                        ml={2}
                        mr={2}
                        variant="unstyled"
                        borderRadius={0}
                        borderColor="customGray"
                        _placeholder={{ color: "placeholder" }}
                        _focus={{ borderColor: "inputBorder" }}
                      />
                      <IconButton
                        aria-label="Delete option"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeleteOption(index, opIndex)}
                        variant="unstyled"
                        opacity="0.7"
                        _hover={{ opacity: "1" }}
                      />
                    </ListItem>
                  ))}
                  <ListItem>
                    <Button
                      onClick={() => handleAddOption(index)}
                      leftIcon={<PlusCircleIcon />}
                      variant="unstyled"
                      color="customGray"
                      fontWeight="normal"
                      fontStyle={"italic"}
                    >
                      Add option
                    </Button>
                  </ListItem>
                </List>
              </Box>
            )}
          </Box>
        </Box>
      ))}
      <Button
        onClick={addQuestion}
        leftIcon={<PlusCircleIcon />}
        variant="unstyled"
        mb = {6}
        mt = {-1}
      >
        Add Question
      </Button>
    </Box>
  );
}
