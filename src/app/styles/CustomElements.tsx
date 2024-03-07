import React from "react";
import { Circle } from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";


export const EmptyCircleIcon = () => (
  <Circle size="17px" bg="transparent" border="1px solid black" />
);

export const PlusCircleIcon = () => (
  <Circle size="17px" bg="transparent" border="1px solid black">
    <AddIcon boxSize="9px" />
  </Circle>
);