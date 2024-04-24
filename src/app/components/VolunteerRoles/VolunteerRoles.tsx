import React, { useEffect, useState } from "react";
import { IVolunteerRole } from "@database/volunteerRoleSchema";
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
import styles from "./VolunteerRoles.module.css";


export default function AddVolunteerRoles(props: {
  roles: IVolunteerRole[];
  setRoles: Function;
}) {

  const [newOptionInputs, setNewOptionInputs] = useState<{
    [index: number]: string;
  }>({});

  useEffect(() => {
    console.log("Roles state changed:", props.roles);
  }, [props.roles]);

  const handleOptionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const updatedRoles = [...props.roles];
    const role = updatedRoles[index];
    role.roleName = e.target.value;
    props.setRoles(updatedRoles);

  };


  const handleDeleteOption = (index: number) => {
    const updatedRoles = [...props.roles];
    updatedRoles.splice(index, 1);
    props.setRoles(updatedRoles);

  };
  

  const addRole = () => {
    const emptyRole: IVolunteerRole = {
      _id: "",
      roleName: "",
      description: "",
      timeslots: [],
      event: ""
    };
    props.setRoles((prevRoles: any) => [...prevRoles, emptyRole]);
  };

  //need to change how it's displayed so after roles are added, shifts can be added, maybe add drop down to change roles/shifts?
  return (

    <Box maxWidth="463px" mx="auto">
      <h2 className={styles.role}>Enter Roles</h2>

        <List>
          {props.roles?.map((role, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <EmptyCircleIcon />
              <Input
                type="text"
                value={role.roleName}
                onChange={(e) =>
                  handleOptionInputChange(e, index)
                }
                placeholder={`Role ${index + 1}`}
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
                aria-label="Delete role"
                icon={<DeleteIcon />}
                onClick={() => handleDeleteOption(index)}
                variant="unstyled"
              />
            </ListItem>
          ))}
          <ListItem>
            <Button
              onClick={addRole}
              leftIcon={<PlusCircleIcon />}
              variant="unstyled"
              color="customGray"
              fontWeight="normal" 
              fontStyle={"italic"}
            >
              Add Role
            </Button>
          </ListItem>
        </List>
    
    </Box>
  );
}
