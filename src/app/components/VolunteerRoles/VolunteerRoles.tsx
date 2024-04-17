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
  Circle,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { EmptyCircleIcon, PlusCircleIcon } from "../../styles/CustomElements";

export default function AddVolunteerRoles(props: {
    roles: IFormQuestion[];
    setRoles: Function;
}){
    const [newOptionInputs, setNewOptionInputs] = useState<{
        [index: number]: string;}>({});
    useEffect(() =>{
        console.log("Roles state changed:", props.roles);
    }, [props.roles]);
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const updatedRoles = [...props.roles];
        updatedRoles[index].question = e.target.value;
        props.setRoles(updatedRoles);
    };
    const handleOptionInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        questionIndex: number,
        optionIndex: number
    ) => {
        const updatedRoles = [...props.roles];
        const question = updatedRoles[questionIndex];
        //change so instead of changing question options, changes to adding roles maybe? 
        /** 
        if (question.options) {
            question.options[optionIndex] = e.target.value;
            props.setRoles(updatedRoles);
          } else {
            console.error("Options are undefined");
        } */

    };
    const handleAddOption = (questionIndex: number) => {
        const updatedRoles = [...props.roles];
        const question = updatedRoles[questionIndex];
        if (question.options) {
            question.options.push(newOptionInputs[questionIndex]);
            setNewOptionInputs({ ...newOptionInputs, [questionIndex]: "" });
            props.setRoles(updatedRoles);
        } else {
            console.error("Options are undefined");
        }
    };

    const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
        const updatedRoles = [...props.roles];
        const question = updatedRoles[questionIndex];
        if (question.options) {
            question.options.splice(optionIndex, 1);
            props.setRoles(updatedRoles);
        } else {
            console.error("Roles are undefined");
        }
    };

    const addRole = () => {
        const emptyQuestion: IFormQuestion = {
            question: "",
            fieldType: "MULTI_SELECT",
            options: [],
        };
        props.setRoles([...props.roles, emptyQuestion]);
    };
    //need to change how it's displayed so after roles are added, shifts can be added, maybe add drop down to change roles/shifts?
    return (
        <Box maxWidth="463px" mx="auto">
          {props.roles.map((question, index) => (
            <Box key={index} mb={4}>
              <Flex align="center" mb={2}>
                <FormControl flex="1" mr="2">
                  <Input
                    type="text"
                    value={question.question}
                    placeholder="Enter Role"
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
                </FormControl>
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
            mt={6}
            onClick={addRole}
            leftIcon={<PlusCircleIcon />}
            variant="unstyled"
          >
            Add Question
          </Button>
        </Box>
      );
}